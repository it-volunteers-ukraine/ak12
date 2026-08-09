/**
 * @jest-environment node
 */
const cloudinaryTestOriginalEnv = { ...process.env };
const cloudinaryFetchMock = jest.fn();

beforeAll(() => {
  global.fetch = cloudinaryFetchMock as unknown as typeof fetch;
});

beforeEach(() => {
  cloudinaryFetchMock.mockReset();

  process.env = {
    ...cloudinaryTestOriginalEnv,
    CLOUDINARY_CLOUD_NAME: "cloud-test",
    CLOUDINARY_API_KEY: "key-123",
    CLOUDINARY_API_SECRET: "supersecret",
    CLOUDINARY_MEDIA_FOLDER: "ak12",
  };

  jest.resetModules();
});

afterAll(() => {
  process.env = cloudinaryTestOriginalEnv;
});

const createCloudinaryTestFile = (overrides: Partial<File> = {}, content = "fake-image-bytes"): File => {
  const baseSize = content.length;

  const base = new File([content], "photo.png", {
    type: "image/png",
  });

  return Object.defineProperties(base, {
    type: {
      value: overrides.type ?? base.type,
      configurable: true,
    },
    size: {
      value: overrides.size ?? baseSize,
      configurable: true,
    },
  }) as File;
};

describe("cloudinaryStorage", () => {
  describe("uploadImage", () => {
    it("successfully uploads image to Cloudinary", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          public_id: "ak12/my-photo",
          secure_url: "https://res.cloudinary.com/cloud-test/image/upload/ak12/my-photo.png",
        }),
      });

      const result = await cloudMod.uploadImage({
        file: createCloudinaryTestFile({
          type: "image/png",
          size: 2048,
        }),
        fileName: "My Photo!",
      });

      expect(result).toEqual({
        publicId: "ak12/my-photo",
        secureUrl: "https://res.cloudinary.com/cloud-test/image/upload/ak12/my-photo.png",
      });
    });

    it("makes POST request to correct Cloudinary endpoint", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          public_id: "ak12/photo",
          secure_url: "https://res.cloudinary.com/cloud-test/image/upload/ak12/photo.png",
        }),
      });

      await cloudMod.uploadImage({
        file: createCloudinaryTestFile({
          type: "image/png",
          size: 2048,
        }),
        fileName: "photo",
      });

      expect(cloudinaryFetchMock).toHaveBeenCalledTimes(1);

      const [url] = cloudinaryFetchMock.mock.calls[0];

      expect(url).toBe("https://api.cloudinary.com/v1_1/cloud-test/image/upload");
    });

    it("sends FormData with file and required metadata", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          public_id: "ak12/photo",
          secure_url: "https://res.cloudinary.com/cloud-test/image/upload/ak12/photo.png",
        }),
      });

      await cloudMod.uploadImage({
        file: createCloudinaryTestFile({
          type: "image/png",
          size: 2048,
        }),
        fileName: "photo",
      });

      const [, init] = cloudinaryFetchMock.mock.calls[0];
      const formData = init.body as FormData;

      expect(formData.get("file")).toBeDefined();
      expect(formData.get("api_key")).toBe("key-123");
      expect(formData.get("folder")).toBe("ak12");
      expect(formData.get("overwrite")).toBe("true");
      expect(formData.get("invalidate")).toBe("true");
    });

    it("includes sanitized public_id in FormData", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          public_id: "ak12/my-photo",
          secure_url: "https://res.cloudinary.com/cloud-test/image/upload/ak12/my-photo.png",
        }),
      });

      await cloudMod.uploadImage({
        file: createCloudinaryTestFile({
          type: "image/png",
          size: 2048,
        }),
        fileName: "My Photo! @#$",
      });

      const [, init] = cloudinaryFetchMock.mock.calls[0];
      const formData = init.body as FormData;

      expect(formData.get("public_id")).toBe("My-Photo");
    });

    it("includes signature with correct format", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          public_id: "ak12/photo",
          secure_url: "https://res.cloudinary.com/cloud-test/image/upload/ak12/photo.png",
        }),
      });

      await cloudMod.uploadImage({
        file: createCloudinaryTestFile({
          type: "image/png",
          size: 2048,
        }),
        fileName: "photo",
      });

      const [, init] = cloudinaryFetchMock.mock.calls[0];
      const formData = init.body as FormData;
      const signature = formData.get("signature");

      expect(typeof signature).toBe("string");
      expect((signature as string).length).toBe(64);
      expect(/^[a-f0-9]{64}$/.test(signature as string)).toBe(true);
    });

    it("includes timestamp in FormData", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          public_id: "ak12/photo",
          secure_url: "https://res.cloudinary.com/cloud-test/image/upload/ak12/photo.png",
        }),
      });

      await cloudMod.uploadImage({
        file: createCloudinaryTestFile({
          type: "image/png",
          size: 2048,
        }),
        fileName: "photo",
      });

      const [, init] = cloudinaryFetchMock.mock.calls[0];
      const formData = init.body as FormData;
      const timestamp = formData.get("timestamp");

      expect(typeof timestamp).toBe("string");
      expect(/^\d+$/.test(timestamp as string)).toBe(true);
    });

    it("validates file before uploading", async () => {
      const cloudMod = require("./cloudinary.client");

      await expect(
        cloudMod.uploadImage({
          file: createCloudinaryTestFile({
            type: "application/pdf",
            size: 2048,
          }),
          fileName: "document",
        }),
      ).rejects.toThrow(/JPG, JPEG, PNG, WEBP/);

      expect(cloudinaryFetchMock).not.toHaveBeenCalled();
    });

    it("rejects file larger than 5 MB before making request", async () => {
      const cloudMod = require("./cloudinary.client");

      await expect(
        cloudMod.uploadImage({
          file: createCloudinaryTestFile({
            type: "image/png",
            size: 5 * 1024 * 1024 + 1,
          }),
          fileName: "large-image",
        }),
      ).rejects.toThrow(/5 MB/);

      expect(cloudinaryFetchMock).not.toHaveBeenCalled();
    });

    it("throws when API returns error response", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: false,
        json: async () => ({
          error: {
            message: "Invalid signature",
          },
        }),
      });

      await expect(
        cloudMod.uploadImage({
          file: createCloudinaryTestFile({
            type: "image/png",
            size: 2048,
          }),
          fileName: "photo",
        }),
      ).rejects.toThrow("Invalid signature");
    });

    it("throws with generic message when error has no message property", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: false,
        json: async () => ({
          error: {},
        }),
      });

      await expect(
        cloudMod.uploadImage({
          file: createCloudinaryTestFile({
            type: "image/png",
            size: 2048,
          }),
          fileName: "photo",
        }),
      ).rejects.toThrow(/Не вдалося завантажити зображення/);
    });

    it("throws when required env vars are missing", async () => {
      process.env = {
        ...cloudinaryTestOriginalEnv,
      };

      delete process.env.CLOUDINARY_CLOUD_NAME;

      jest.resetModules();

      const cloudMod = require("./cloudinary.client");

      await expect(
        cloudMod.uploadImage({
          file: createCloudinaryTestFile({
            type: "image/png",
            size: 2048,
          }),
          fileName: "photo",
        }),
      ).rejects.toThrow(/змінні середовища/);

      expect(cloudinaryFetchMock).not.toHaveBeenCalled();
    });

    it("throws when CLOUDINARY_MEDIA_FOLDER is missing", async () => {
      process.env = {
        ...cloudinaryTestOriginalEnv,
        CLOUDINARY_CLOUD_NAME: "cloud-test",
        CLOUDINARY_API_KEY: "key-123",
        CLOUDINARY_API_SECRET: "supersecret",
      };

      delete process.env.CLOUDINARY_MEDIA_FOLDER;

      jest.resetModules();

      const cloudMod = require("./cloudinary.client");

      await expect(
        cloudMod.uploadImage({
          file: createCloudinaryTestFile({
            type: "image/png",
            size: 2048,
          }),
          fileName: "photo",
        }),
      ).rejects.toThrow(/змінні середовища/);
    });

    it("sets cache: no-store in fetch request", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          public_id: "ak12/photo",
          secure_url: "https://res.cloudinary.com/cloud-test/image/upload/ak12/photo.png",
        }),
      });

      await cloudMod.uploadImage({
        file: createCloudinaryTestFile({
          type: "image/png",
          size: 2048,
        }),
        fileName: "photo",
      });

      const [, init] = cloudinaryFetchMock.mock.calls[0];

      expect(init.cache).toBe("no-store");
    });

    it("uses POST method", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          public_id: "ak12/photo",
          secure_url: "https://res.cloudinary.com/cloud-test/image/upload/ak12/photo.png",
        }),
      });

      await cloudMod.uploadImage({
        file: createCloudinaryTestFile({
          type: "image/png",
          size: 2048,
        }),
        fileName: "photo",
      });

      const [, init] = cloudinaryFetchMock.mock.calls[0];

      expect(init.method).toBe("POST");
    });
  });

  describe("deleteImage", () => {
    it("successfully deletes image from Cloudinary", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "ok",
        }),
      });

      await expect(cloudMod.deleteImage("ak12/photo")).resolves.toBeUndefined();
    });

    it("makes POST request to correct delete endpoint", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "ok",
        }),
      });

      await cloudMod.deleteImage("ak12/photo");

      expect(cloudinaryFetchMock).toHaveBeenCalledTimes(1);

      const [url] = cloudinaryFetchMock.mock.calls[0];

      expect(url).toBe("https://api.cloudinary.com/v1_1/cloud-test/image/destroy");
    });

    it("includes publicId in FormData", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "ok",
        }),
      });

      await cloudMod.deleteImage("ak12/my-photo");

      const [, init] = cloudinaryFetchMock.mock.calls[0];
      const formData = init.body as FormData;

      expect(formData.get("public_id")).toBe("ak12/my-photo");
    });

    it("includes api_key and signature", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "ok",
        }),
      });

      await cloudMod.deleteImage("ak12/photo");

      const [, init] = cloudinaryFetchMock.mock.calls[0];
      const formData = init.body as FormData;

      expect(formData.get("api_key")).toBe("key-123");
      expect(formData.get("signature")).toBeDefined();
    });

    it("includes invalidate: true", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "ok",
        }),
      });

      await cloudMod.deleteImage("ak12/photo");

      const [, init] = cloudinaryFetchMock.mock.calls[0];
      const formData = init.body as FormData;

      expect(formData.get("invalidate")).toBe("true");
    });

    it("throws when API returns error response", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: false,
        json: async () => ({
          error: {
            message: "Not found",
          },
        }),
      });

      await expect(cloudMod.deleteImage("ak12/nonexistent")).rejects.toThrow("Not found");
    });

    it("throws with generic message on API error without message", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: false,
        json: async () => ({
          error: {},
        }),
      });

      await expect(cloudMod.deleteImage("ak12/photo")).rejects.toThrow(/Не вдалося видалити/);
    });

    it("throws when required env vars are missing", async () => {
      process.env = {
        ...cloudinaryTestOriginalEnv,
        CLOUDINARY_CLOUD_NAME: "cloud-test",
        CLOUDINARY_API_SECRET: "supersecret",
        CLOUDINARY_MEDIA_FOLDER: "ak12",
      };

      delete process.env.CLOUDINARY_API_KEY;

      jest.resetModules();

      const cloudMod = require("./cloudinary.client");

      await expect(cloudMod.deleteImage("ak12/photo")).rejects.toThrow(/змінні середовища/);

      expect(cloudinaryFetchMock).not.toHaveBeenCalled();
    });

    it("sets cache: no-store in fetch request", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "ok",
        }),
      });

      await cloudMod.deleteImage("ak12/photo");

      const [, init] = cloudinaryFetchMock.mock.calls[0];

      expect(init.cache).toBe("no-store");
    });

    it("uses POST method", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "ok",
        }),
      });

      await cloudMod.deleteImage("ak12/photo");

      const [, init] = cloudinaryFetchMock.mock.calls[0];

      expect(init.method).toBe("POST");
    });
  });

  describe("cloudinaryStorage interface", () => {
    it("exports storage object with uploadImage method", () => {
      const cloudMod = require("./cloudinary.client");

      expect(cloudMod.cloudinaryStorage).toBeDefined();
      expect(typeof cloudMod.cloudinaryStorage.uploadImage).toBe("function");
    });

    it("exports storage object with deleteImage method", () => {
      const cloudMod = require("./cloudinary.client");

      expect(cloudMod.cloudinaryStorage).toBeDefined();
      expect(typeof cloudMod.cloudinaryStorage.deleteImage).toBe("function");
    });

    it("uploadImage method delegates to uploadImage function", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          public_id: "ak12/photo",
          secure_url: "https://res.cloudinary.com/cloud-test/image/upload/ak12/photo.png",
        }),
      });

      const result = await cloudMod.cloudinaryStorage.uploadImage({
        file: createCloudinaryTestFile({
          type: "image/png",
          size: 2048,
        }),
        fileName: "photo",
      });

      expect(result).toHaveProperty("publicId");
      expect(result).toHaveProperty("secureUrl");
    });

    it("deleteImage method delegates to deleteImage function", async () => {
      const cloudMod = require("./cloudinary.client");

      cloudinaryFetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "ok",
        }),
      });

      await expect(cloudMod.cloudinaryStorage.deleteImage("ak12/photo")).resolves.toBeUndefined();
    });
  });
});

export {};
