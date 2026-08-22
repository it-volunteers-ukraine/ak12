/**
 * @jest-environment node
 */
const originalProcessEnv = { ...process.env };

beforeEach(() => {
  process.env = { ...originalProcessEnv };
});

afterAll(() => {
  process.env = originalProcessEnv;
});

type StorageEnv = {
  STORAGE_CLIENT?: string;
  STORAGE_ENDPOINT?: string;
  STORAGE_ACCESS_KEY?: string;
  STORAGE_SECRET_KEY?: string;
  STORAGE_BUCKET?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  CLOUDINARY_MEDIA_FOLDER?: string;
};

function getStorageWithEnv(env: StorageEnv) {
  process.env = {
    ...process.env,
    ...env,
  };

  jest.resetModules();

  const { getStorage } = require("./index");

  return getStorage();
}

const minioEnv: StorageEnv = {
  STORAGE_CLIENT: "minio",
  STORAGE_ENDPOINT: "http://localhost:9000",
  STORAGE_ACCESS_KEY: "minioadmin",
  STORAGE_SECRET_KEY: "minioadmin",
  STORAGE_BUCKET: "test-bucket",
};

const cloudinaryEnv: StorageEnv = {
  STORAGE_CLIENT: "cloudinary",
  CLOUDINARY_CLOUD_NAME: "test-cloud",
  CLOUDINARY_API_KEY: "test-key",
  CLOUDINARY_API_SECRET: "test-secret",
  CLOUDINARY_MEDIA_FOLDER: "test-folder",
};

describe("getStorage", () => {
  describe("storage client selection", () => {
    it("returns minioStorage when storage client is 'minio'", () => {
      const storage = getStorageWithEnv(minioEnv);

      expect(storage).toBeDefined();
      expect(storage.uploadImage).toBeDefined();
      expect(storage.deleteImage).toBeDefined();
    });

    it("returns cloudinaryStorage when storage client is 'cloudinary'", () => {
      const storage = getStorageWithEnv(cloudinaryEnv);

      expect(storage).toBeDefined();
      expect(storage.uploadImage).toBeDefined();
      expect(storage.deleteImage).toBeDefined();
    });

    it("returns cloudinaryStorage by default when storage client not set to minio", () => {
      const storage = getStorageWithEnv({
        ...cloudinaryEnv,
        STORAGE_CLIENT: "unknown",
      });

      expect(storage).toBeDefined();
      expect(storage.uploadImage).toBeDefined();
      expect(storage.deleteImage).toBeDefined();
    });
  });

  describe("singleton pattern", () => {
    it("returns same instance on multiple calls", () => {
      process.env = {
        ...process.env,
        ...minioEnv,
      };

      jest.resetModules();

      const { getStorage } = require("./index");
      const storage1 = getStorage();
      const storage2 = getStorage();

      expect(storage1).toBe(storage2);
    });
  });

  describe("storage interface contract", () => {
    it("returned storage implements uploadImage method", () => {
      const storage = getStorageWithEnv(minioEnv);

      expect(typeof storage.uploadImage).toBe("function");
      expect(storage.uploadImage.length).toBeGreaterThanOrEqual(1);
    });

    it("returned storage implements deleteImage method", () => {
      const storage = getStorageWithEnv(minioEnv);

      expect(typeof storage.deleteImage).toBe("function");
      expect(storage.deleteImage.length).toBeGreaterThanOrEqual(1);
    });
  });
});
