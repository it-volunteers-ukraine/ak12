/**
 * @jest-environment node
 */
const originalProcessEnv = { ...process.env };

beforeEach(() => {
  process.env = { ...originalProcessEnv };
  jest.resetModules();
});

afterAll(() => {
  process.env = originalProcessEnv;
});

describe("getStorage", () => {
  describe("storage client selection", () => {
    it("returns minioStorage when storage client is 'minio'", () => {
      process.env.STORAGE_CLIENT = "minio";
      process.env.STORAGE_ENDPOINT = "http://localhost:9000";
      process.env.STORAGE_ACCESS_KEY = "minioadmin";
      process.env.STORAGE_SECRET_KEY = "minioadmin";
      process.env.STORAGE_BUCKET = "test-bucket";

      jest.resetModules();

      const { getStorage } = require("./index");
      const storage = getStorage();

      expect(storage).toBeDefined();
      expect(storage.uploadImage).toBeDefined();
      expect(storage.deleteImage).toBeDefined();
    });

    it("returns cloudinaryStorage when storage client is 'cloudinary'", () => {
      process.env.STORAGE_CLIENT = "cloudinary";
      process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
      process.env.CLOUDINARY_API_KEY = "test-key";
      process.env.CLOUDINARY_API_SECRET = "test-secret";
      process.env.CLOUDINARY_MEDIA_FOLDER = "test-folder";

      jest.resetModules();

      const { getStorage } = require("./index");
      const storage = getStorage();

      expect(storage).toBeDefined();
      expect(storage.uploadImage).toBeDefined();
      expect(storage.deleteImage).toBeDefined();
    });

    it("returns cloudinaryStorage by default when storage client not set to minio", () => {
      process.env.STORAGE_CLIENT = "unknown";
      process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
      process.env.CLOUDINARY_API_KEY = "test-key";
      process.env.CLOUDINARY_API_SECRET = "test-secret";
      process.env.CLOUDINARY_MEDIA_FOLDER = "test-folder";

      jest.resetModules();

      const { getStorage } = require("./index");
      const storage = getStorage();

      expect(storage).toBeDefined();
      expect(storage.uploadImage).toBeDefined();
      expect(storage.deleteImage).toBeDefined();
    });
  });

  describe("singleton pattern", () => {
    it("returns same instance on multiple calls", () => {
      process.env.STORAGE_CLIENT = "minio";
      process.env.STORAGE_ENDPOINT = "http://localhost:9000";
      process.env.STORAGE_ACCESS_KEY = "minioadmin";
      process.env.STORAGE_SECRET_KEY = "minioadmin";
      process.env.STORAGE_BUCKET = "test-bucket";

      jest.resetModules();

      const { getStorage } = require("./index");

      const storage1 = getStorage();
      const storage2 = getStorage();

      expect(storage1).toBe(storage2);
    });
  });

  describe("storage interface contract", () => {
    it("returned storage implements uploadImage method", () => {
      process.env.STORAGE_CLIENT = "minio";
      process.env.STORAGE_ENDPOINT = "http://localhost:9000";
      process.env.STORAGE_ACCESS_KEY = "minioadmin";
      process.env.STORAGE_SECRET_KEY = "minioadmin";
      process.env.STORAGE_BUCKET = "test-bucket";

      jest.resetModules();

      const { getStorage } = require("./index");
      const storage = getStorage();

      expect(typeof storage.uploadImage).toBe("function");
      expect(storage.uploadImage.length).toBeGreaterThanOrEqual(1);
    });

    it("returned storage implements deleteImage method", () => {
      process.env.STORAGE_CLIENT = "minio";
      process.env.STORAGE_ENDPOINT = "http://localhost:9000";
      process.env.STORAGE_ACCESS_KEY = "minioadmin";
      process.env.STORAGE_SECRET_KEY = "minioadmin";
      process.env.STORAGE_BUCKET = "test-bucket";

      jest.resetModules();

      const { getStorage } = require("./index");
      const storage = getStorage();

      expect(typeof storage.deleteImage).toBe("function");
      expect(storage.deleteImage.length).toBeGreaterThanOrEqual(1);
    });
  });
});
