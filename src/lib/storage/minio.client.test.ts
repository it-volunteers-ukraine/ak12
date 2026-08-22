/**
 * @jest-environment node
 */
const ORIGINAL_ENV = { ...process.env };
const putObjectMock = jest.fn();
const removeObjectMock = jest.fn();

jest.mock("minio", () => ({
  Client: jest.fn().mockImplementation(() => ({
    putObject: putObjectMock,
    removeObject: removeObjectMock,
  })),
}));

const makeFile = (overrides: Partial<{ type: string; size: number }> = {}, content = "fake-image-bytes") => {
  const base = new File([content], "photo.png", {
    type: "image/png",
  });

  return Object.defineProperties(base, {
    type: {
      value: overrides.type ?? base.type,
      configurable: true,
    },
    size: {
      value: overrides.size ?? content.length,
      configurable: true,
    },
  }) as File;
};

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    STORAGE_ENDPOINT: "http://localhost:9000",
    STORAGE_ACCESS_KEY: "minioadmin",
    STORAGE_SECRET_KEY: "minioadmin",
    STORAGE_BUCKET: "test-bucket",
    STORAGE_MEDIA_FOLDER: "media",
  };

  putObjectMock.mockReset();
  removeObjectMock.mockReset();
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe("minioStorage", () => {
  describe("uploadImage", () => {
    it("uploads image to MinIO and returns stored image data", async () => {
      const { minioStorage } = await import("./minio.client");

      const result = await minioStorage.uploadImage({
        file: makeFile({ type: "image/png" }),
        fileName: "hero-background",
      });

      expect(putObjectMock).toHaveBeenCalledTimes(1);
      expect(result.publicId).toMatch(/^media\/hero-background-[0-9a-f-]+\.png$/);
      expect(result.secureUrl).toBe(`/api/media/${result.publicId}`);
    });

    it("passes correct bucket, object key, file content and content type to MinIO", async () => {
      const { minioStorage } = await import("./minio.client");

      const file = makeFile({ type: "image/png" }, "image-content");

      await minioStorage.uploadImage({
        file,
        fileName: "hero-background",
      });

      const [bucket, objectKey, body, size, metadata] = putObjectMock.mock.calls[0];

      expect(bucket).toBe("test-bucket");
      expect(objectKey).toMatch(/^media\/hero-background-[0-9a-f-]+\.png$/);
      expect(body).toEqual(Buffer.from("image-content"));
      expect(size).toBe(Buffer.byteLength("image-content"));
      expect(metadata).toEqual({
        "Content-Type": "image/png",
      });
    });

    it("generates different object keys for repeated uploads of the same file name", async () => {
      const { minioStorage } = await import("./minio.client");

      const file = makeFile({ type: "image/jpeg" });

      const first = await minioStorage.uploadImage({
        file,
        fileName: "hero-background",
      });

      const second = await minioStorage.uploadImage({
        file,
        fileName: "hero-background",
      });

      expect(first.publicId).not.toBe(second.publicId);
      expect(putObjectMock).toHaveBeenCalledTimes(2);
    });

    it("uses the configured media folder in the object key", async () => {
      const { minioStorage } = await import("./minio.client");

      const result = await minioStorage.uploadImage({
        file: makeFile({ type: "image/png" }),
        fileName: "photo",
      });

      expect(result.publicId).toMatch(/^media\/photo-/);
    });

    it("throws when media folder is not configured", async () => {
      delete process.env.STORAGE_MEDIA_FOLDER;

      const { minioStorage } = await import("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({ type: "image/png" }),
          fileName: "photo",
        }),
      ).rejects.toThrow("Не налаштовано STORAGE_MEDIA_FOLDER.");

      expect(putObjectMock).not.toHaveBeenCalled();
    });

    it.each([
      ["image/png", "png"],
      ["image/jpeg", "jpg"],
      ["image/jpg", "jpg"],
      ["image/webp", "webp"],
    ])("uses %s MIME type with .%s extension", async (type, extension) => {
      const { minioStorage } = await import("./minio.client");

      const result = await minioStorage.uploadImage({
        file: makeFile({ type }),
        fileName: "photo",
      });

      expect(result.publicId).toMatch(new RegExp(`\\.${extension}$`));
    });

    it("sanitizes the file name before creating the object key", async () => {
      const { minioStorage } = await import("./minio.client");

      const result = await minioStorage.uploadImage({
        file: makeFile({ type: "image/png" }),
        fileName: "My Photo! @#$%",
      });

      expect(result.publicId).toMatch(/^media\/My-Photo-/);
    });

    it("rejects unsupported file type before calling MinIO", async () => {
      const { minioStorage } = await import("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({ type: "application/pdf" }),
          fileName: "document",
        }),
      ).rejects.toThrow("Допустимі формати: JPG, JPEG, PNG, WEBP");

      expect(putObjectMock).not.toHaveBeenCalled();
    });

    it("rejects files larger than 5 MB before calling MinIO", async () => {
      const { minioStorage } = await import("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({
            type: "image/png",
            size: 5 * 1024 * 1024 + 1,
          }),
          fileName: "large-image",
        }),
      ).rejects.toThrow("Максимальна вага файлу — 5 MB");

      expect(putObjectMock).not.toHaveBeenCalled();
    });

    it("rejects empty file name before calling MinIO", async () => {
      const { minioStorage } = await import("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({ type: "image/png" }),
          fileName: "   ",
        }),
      ).rejects.toThrow("Назва файлу є обов'язковою");

      expect(putObjectMock).not.toHaveBeenCalled();
    });

    it("throws when storage bucket is not configured", async () => {
      delete process.env.STORAGE_BUCKET;

      const { minioStorage } = await import("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({ type: "image/png" }),
          fileName: "photo",
        }),
      ).rejects.toThrow("Не налаштовано STORAGE_BUCKET");

      expect(putObjectMock).not.toHaveBeenCalled();
    });

    it("throws when MinIO upload fails", async () => {
      putObjectMock.mockRejectedValueOnce(new Error("MinIO upload failed"));

      const { minioStorage } = await import("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({ type: "image/png" }),
          fileName: "photo",
        }),
      ).rejects.toThrow("MinIO upload failed");
    });

    it("throws when MinIO storage configuration is incomplete", async () => {
      process.env.STORAGE_ENDPOINT = "http://localhost:9000";
      process.env.STORAGE_ACCESS_KEY = "test-access-key";
      process.env.STORAGE_SECRET_KEY = "test-secret-key";

      delete process.env.STORAGE_ENDPOINT;

      jest.resetModules();

      const { minioStorage } = require("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({
            type: "image/png",
            size: 2048,
          }),
          fileName: "photo",
        }),
      ).rejects.toThrow(
        "Не налаштовано сховище. Необхідні STORAGE_ENDPOINT, STORAGE_ACCESS_KEY та STORAGE_SECRET_KEY.",
      );

      expect(putObjectMock).not.toHaveBeenCalled();
    });

    it("throws when MIME type has no supported extension", async () => {
      jest.doMock("./file-validation", () => ({
        validateImageFile: jest.fn().mockResolvedValue(undefined),
      }));

      jest.resetModules();

      const { minioStorage } = await import("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({ type: "image/bmp" }),
          fileName: "photo",
        }),
      ).rejects.toThrow("Непідтримуваний формат зображення.");

      expect(putObjectMock).not.toHaveBeenCalled();
    });
  });

  describe("deleteImage", () => {
    it("removes image from MinIO using its publicId", async () => {
      const { minioStorage } = await import("./minio.client");

      await minioStorage.deleteImage("media/hero-background-123.png");

      expect(removeObjectMock).toHaveBeenCalledTimes(1);
      expect(removeObjectMock).toHaveBeenCalledWith("test-bucket", "media/hero-background-123.png");
    });

    it("throws when storage bucket is not configured", async () => {
      delete process.env.STORAGE_BUCKET;

      const { minioStorage } = await import("./minio.client");

      await expect(minioStorage.deleteImage("media/photo.png")).rejects.toThrow("Не налаштовано STORAGE_BUCKET");

      expect(removeObjectMock).not.toHaveBeenCalled();
    });

    it("propagates MinIO delete errors", async () => {
      removeObjectMock.mockRejectedValueOnce(new Error("MinIO delete failed"));

      const { minioStorage } = await import("./minio.client");

      await expect(minioStorage.deleteImage("media/photo.png")).rejects.toThrow("MinIO delete failed");
    });
  });

  describe("getImageUrl", () => {
    it("returns the media API URL for an image", async () => {
      const { minioStorage } = await import("./minio.client");

      const result = minioStorage.getImageUrl("Background.png");

      expect(result).toBe("/api/media/media/Background.png");
    });

    it("returns undefined when the file name is empty", async () => {
      const { minioStorage } = await import("./minio.client");

      expect(minioStorage.getImageUrl("")).toBeUndefined();
    });

    it("returns undefined when the file name is missing", async () => {
      const { minioStorage } = await import("./minio.client");

      expect(minioStorage.getImageUrl(undefined as unknown as string)).toBeUndefined();
    });

    it("uses the configured media folder in the URL", async () => {
      process.env.STORAGE_MEDIA_FOLDER = "custom-folder";

      const { minioStorage } = await import("./minio.client");

      expect(minioStorage.getImageUrl("Background.png")).toBe("/api/media/custom-folder/Background.png");
    });

    it("throws when media folder is not configured", async () => {
      delete process.env.STORAGE_MEDIA_FOLDER;

      const { minioStorage } = await import("./minio.client");

      expect(() => minioStorage.getImageUrl("Background.png")).toThrow("Не налаштовано STORAGE_MEDIA_FOLDER.");
    });

    it("does not require MinIO client credentials to generate the URL", async () => {
      delete process.env.STORAGE_ACCESS_KEY;
      delete process.env.STORAGE_SECRET_KEY;

      const { minioStorage } = await import("./minio.client");

      expect(minioStorage.getImageUrl("Background.png")).toBe("/api/media/media/Background.png");
    });
  });

  describe("ImageStorage interface", () => {
    it("exposes uploadImage, deleteImage and getImageUrl methods", async () => {
      const { minioStorage } = await import("./minio.client");

      expect(minioStorage).toBeDefined();
      expect(typeof minioStorage.uploadImage).toBe("function");
      expect(typeof minioStorage.deleteImage).toBe("function");
      expect(typeof minioStorage.getImageUrl).toBe("function");
    });
  });
});
