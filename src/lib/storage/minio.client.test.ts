/**
 * @jest-environment node
 */
const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  jest.clearAllMocks();
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

jest.mock("@aws-sdk/client-s3");

let sendMock: jest.Mock;

const makeFile = (overrides: Partial<File> = {}, content = "fake-image-bytes") => {
  const baseSize = content.length;
  const base = new File([content], "photo.png", { type: "image/png" });

  return Object.defineProperties(base, {
    type: { value: overrides.type ?? base.type, configurable: true },
    size: { value: overrides.size ?? baseSize, configurable: true },
  }) as File;
};

describe("minioStorage", () => {
  beforeEach(() => {
    sendMock = jest.fn().mockResolvedValue({});
    jest.doMock("@/lib/storage/s3-client", () => ({
      getS3Client: () => ({ send: sendMock }),
    }));
  });

  describe("uploadImage", () => {
    it("uploads image and returns publicId and secureUrl", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";
      process.env.STORAGE_MEDIA_FOLDER = "media";

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      const result = await minioStorage.uploadImage({
        file: makeFile({ type: "image/png", size: 2048 }),
        fileName: "test-photo",
      });

      expect(result).toHaveProperty("publicId");
      expect(result).toHaveProperty("secureUrl");
      expect(typeof result.publicId).toBe("string");
      expect(typeof result.secureUrl).toBe("string");
    });

    it("generates unique publicId with UUID for same filename", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";
      process.env.STORAGE_MEDIA_FOLDER = "media";

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      const result1 = await minioStorage.uploadImage({
        file: makeFile({ type: "image/png", size: 2048 }),
        fileName: "photo",
      });

      const result2 = await minioStorage.uploadImage({
        file: makeFile({ type: "image/png", size: 2048 }),
        fileName: "photo",
      });

      expect(result1.publicId).not.toBe(result2.publicId);
    });

    it("includes media folder in publicId when configured", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";
      process.env.STORAGE_MEDIA_FOLDER = "uploads";

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      const result = await minioStorage.uploadImage({
        file: makeFile({ type: "image/png", size: 2048 }),
        fileName: "photo",
      });

      expect(result.publicId).toMatch(/^uploads\//);
    });

    it("omits folder from publicId when STORAGE_MEDIA_FOLDER not set", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";
      delete process.env.STORAGE_MEDIA_FOLDER;

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      const result = await minioStorage.uploadImage({
        file: makeFile({ type: "image/png", size: 2048 }),
        fileName: "photo",
      });

      expect(result.publicId).not.toMatch(/\//);
    });

    it("adds correct file extension based on MIME type for all supported formats", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";
      delete process.env.STORAGE_MEDIA_FOLDER;

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      const testCases = [
        { type: "image/png" as const, ext: "png" },
        { type: "image/jpeg" as const, ext: "jpg" },
        { type: "image/jpg" as const, ext: "jpg" },
        { type: "image/webp" as const, ext: "webp" },
      ];

      for (const { type, ext } of testCases) {
        const result = await minioStorage.uploadImage({
          file: makeFile({ type, size: 2048 }),
          fileName: "photo",
        });

        expect(result.publicId).toMatch(new RegExp(`\\.${ext}$`));
      }
    });

    it("sanitizes fileName in publicId", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";
      delete process.env.STORAGE_MEDIA_FOLDER;

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      const result = await minioStorage.uploadImage({
        file: makeFile({ type: "image/png", size: 2048 }),
        fileName: "My Photo! @#$%",
      });

      expect(result.publicId).toMatch(/My-Photo/);
    });

    it("returns secureUrl with /api/media/ prefix and publicId", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";
      process.env.STORAGE_MEDIA_FOLDER = "uploads";

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      const result = await minioStorage.uploadImage({
        file: makeFile({ type: "image/png", size: 2048 }),
        fileName: "photo",
      });

      expect(result.secureUrl).toMatch(/^\/api\/media\//);
      expect(result.secureUrl).toBe(`/api/media/${result.publicId}`);
    });

    it("validates file before uploading", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({ type: "application/pdf", size: 2048 }),
          fileName: "document",
        }),
      ).rejects.toThrow(/JPG, JPEG, PNG, WEBP/);

      expect(sendMock).not.toHaveBeenCalled();
    });

    it("rejects file larger than 5 MB", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({ type: "image/png", size: 5 * 1024 * 1024 + 1 }),
          fileName: "large",
        }),
      ).rejects.toThrow(/5 MB/);

      expect(sendMock).not.toHaveBeenCalled();
    });

    it("throws when STORAGE_BUCKET is missing", async () => {
      delete process.env.STORAGE_BUCKET;

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({ type: "image/png", size: 2048 }),
          fileName: "photo",
        }),
      ).rejects.toThrow("Missing STORAGE_BUCKET");

      expect(sendMock).not.toHaveBeenCalled();
    });

    it("throws when fileName is empty/whitespace only", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({ type: "image/png", size: 2048 }),
          fileName: "   ",
        }),
      ).rejects.toThrow(/Назва файлу/);

      expect(sendMock).not.toHaveBeenCalled();
    });

    it("throws when unsupported MIME type provided", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({ type: "image/bmp", size: 2048 }),
          fileName: "photo",
        }),
      ).rejects.toThrow(/JPG, JPEG, PNG, WEBP/);

      expect(sendMock).not.toHaveBeenCalled();
    });

    it("throws when S3 client send fails", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";
      sendMock.mockRejectedValueOnce(new Error("Connection failed"));

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({ type: "image/png", size: 2048 }),
          fileName: "photo",
        }),
      ).rejects.toThrow("Connection failed");
    });
  });

  describe("deleteImage", () => {
    it("deletes image from S3", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      await expect(minioStorage.deleteImage("uploads/photo-uuid.png")).resolves.toBeUndefined();

      expect(sendMock).toHaveBeenCalledTimes(1);
    });

    it("throws when STORAGE_BUCKET is missing", async () => {
      delete process.env.STORAGE_BUCKET;

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      await expect(minioStorage.deleteImage("photo.png")).rejects.toThrow("Missing STORAGE_BUCKET");

      expect(sendMock).not.toHaveBeenCalled();
    });

    it("throws when S3 client send fails", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";
      sendMock.mockRejectedValueOnce(new Error("S3 error"));

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      await expect(minioStorage.deleteImage("photo.png")).rejects.toThrow("S3 error");
    });

    it("handles empty publicId without throwing", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      await minioStorage.deleteImage("");

      expect(sendMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("minioStorage interface contract", () => {
    it("exports storage object implementing ImageStorage interface", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      expect(minioStorage).toBeDefined();
      expect(typeof minioStorage.uploadImage).toBe("function");
      expect(typeof minioStorage.deleteImage).toBe("function");
    });

    it("uploadImage returns StoredImage with publicId and secureUrl", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      const result = await minioStorage.uploadImage({
        file: makeFile({ type: "image/png", size: 2048 }),
        fileName: "photo",
      });

      expect(result).toHaveProperty("publicId");
      expect(result).toHaveProperty("secureUrl");
      expect(typeof result.publicId).toBe("string");
      expect(typeof result.secureUrl).toBe("string");
    });

    it("uploadImage and deleteImage follow ImageStorage contract", async () => {
      process.env.STORAGE_BUCKET = "test-bucket";

      jest.resetModules();
      const { minioStorage } = require("./minio.client");

      const params = {
        file: makeFile({ type: "image/png", size: 2048 }),
        fileName: "photo",
      };

      const uploadResult = await minioStorage.uploadImage(params);

      await expect(minioStorage.deleteImage(uploadResult.publicId)).resolves.toBeUndefined();
    });
  });
});
