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

const makeFile = (overrides: Partial<{ type: string; size: number }> = {}, content = "fake-image-bytes"): File => {
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
    STORAGE_MEDIA_FOLDER: "ak12",
  };

  putObjectMock.mockReset();
  removeObjectMock.mockReset();

  jest.resetModules();
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe("minioStorage", () => {
  describe("getMinioClient", () => {
    it("creates MinIO client with configured endpoint and credentials", async () => {
      const { getMinioClient } = await import("./minio.client");
      const { Client } = await import("minio");

      getMinioClient();

      expect(Client).toHaveBeenCalledWith({
        endPoint: "localhost",
        port: 9000,
        useSSL: false,
        accessKey: "minioadmin",
        secretKey: "minioadmin",
      });
    });

    it("reuses the same MinIO client instance", async () => {
      const { getMinioClient } = await import("./minio.client");

      const first = getMinioClient();
      const second = getMinioClient();

      expect(first).toBe(second);
    });

    it("throws when MinIO storage configuration is incomplete", async () => {
      delete process.env.STORAGE_ENDPOINT;

      const { minioStorage } = await import("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile(),
          fileName: "photo",
        }),
      ).rejects.toThrow(
        "Не налаштовано сховище. Необхідні STORAGE_ENDPOINT, STORAGE_ACCESS_KEY та STORAGE_SECRET_KEY.",
      );

      expect(putObjectMock).not.toHaveBeenCalled();
    });
  });

  describe("uploadImage", () => {
    it("uploads image to MinIO and returns stored image data", async () => {
      const { minioStorage } = await import("./minio.client");

      const result = await minioStorage.uploadImage({
        file: makeFile({ type: "image/png" }),
        fileName: "hero-background",
      });

      expect(putObjectMock).toHaveBeenCalledTimes(1);
      expect(result.publicId).toMatch(/^ak12\/hero-background-[0-9a-f-]+\.png$/);
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
      expect(objectKey).toMatch(/^ak12\/hero-background-[0-9a-f-]+\.png$/);
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

      expect(result.publicId).toMatch(/^ak12\/photo-[0-9a-f-]+\.png$/);
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

      expect(result.publicId).toMatch(/^ak12\/My-Photo-[0-9a-f-]+\.png$/);
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

    it("throws when MIME type has no supported extension", async () => {
      jest.doMock("./file-validation", () => ({
        validateImageFile: jest.fn().mockResolvedValue(undefined),
      }));

      const { minioStorage } = await import("./minio.client");

      await expect(
        minioStorage.uploadImage({
          file: makeFile({ type: "image/bmp" }),
          fileName: "photo",
        }),
      ).rejects.toThrow("Непідтримуваний формат зображення.");

      expect(putObjectMock).not.toHaveBeenCalled();

      jest.dontMock("./file-validation");
    });
  });

  describe("deleteImage", () => {
    it("removes image from MinIO using its publicId", async () => {
      const { minioStorage } = await import("./minio.client");

      await minioStorage.deleteImage("ak12/hero-background-123.png");

      expect(removeObjectMock).toHaveBeenCalledTimes(1);
      expect(removeObjectMock).toHaveBeenCalledWith("test-bucket", "ak12/hero-background-123.png");
    });

    it("throws when image does not belong to the configured media folder", async () => {
      const { minioStorage } = await import("./minio.client");

      await expect(minioStorage.deleteImage("legacy-cloudinary-image-id")).rejects.toThrow(
        "Image does not belong to the configured storage folder: legacy-cloudinary-image-id",
      );

      expect(removeObjectMock).not.toHaveBeenCalled();
    });

    it("throws when storage bucket is not configured", async () => {
      delete process.env.STORAGE_BUCKET;

      const { minioStorage } = await import("./minio.client");

      await expect(minioStorage.deleteImage("ak12/photo.png")).rejects.toThrow("Не налаштовано STORAGE_BUCKET");

      expect(removeObjectMock).not.toHaveBeenCalled();
    });

    it("propagates MinIO delete errors", async () => {
      removeObjectMock.mockRejectedValueOnce(new Error("MinIO delete failed"));

      const { minioStorage } = await import("./minio.client");

      await expect(minioStorage.deleteImage("ak12/photo.png")).rejects.toThrow("MinIO delete failed");
    });

    it("does not remove an image outside the configured folder", async () => {
      const { minioStorage } = await import("./minio.client");

      await expect(minioStorage.deleteImage("other-folder/photo.png")).rejects.toThrow(
        "Image does not belong to the configured storage folder: other-folder/photo.png",
      );

      expect(removeObjectMock).not.toHaveBeenCalled();
    });
  });

  describe("getImageUrl", () => {
    it("returns the media API URL for Background.png in the configured folder", async () => {
      const { minioStorage } = await import("./minio.client");

      expect(minioStorage.getImageUrl("Background.png")).toBe("/api/media/ak12/Background.png");
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

    it("returns undefined when media folder is not configured", async () => {
      delete process.env.STORAGE_MEDIA_FOLDER;

      const { minioStorage } = await import("./minio.client");

      expect(minioStorage.getImageUrl("Background.png")).toBeUndefined();
    });

    it("does not require MinIO endpoint or credentials to generate the URL", async () => {
      delete process.env.STORAGE_ENDPOINT;
      delete process.env.STORAGE_ACCESS_KEY;
      delete process.env.STORAGE_SECRET_KEY;

      const { minioStorage } = await import("./minio.client");

      expect(minioStorage.getImageUrl("Background.png")).toBe("/api/media/ak12/Background.png");
    });

    it("preserves nested file paths", async () => {
      const { minioStorage } = await import("./minio.client");

      expect(minioStorage.getImageUrl("uploads/2024/photo.png")).toBe("/api/media/ak12/uploads/2024/photo.png");
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
