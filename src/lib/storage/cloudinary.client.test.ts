/**
 * @jest-environment node
 */
const ORIGINAL_ENV = { ...process.env };
const fetchMock = jest.fn();

beforeAll(() => {
  global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(() => {
  fetchMock.mockReset();

  process.env = {
    ...ORIGINAL_ENV,
    CLOUDINARY_CLOUD_NAME: "cloud-test",
    CLOUDINARY_API_KEY: "key-123",
    CLOUDINARY_API_SECRET: "supersecret",
    CLOUDINARY_MEDIA_FOLDER: "ak12",
  };

  jest.resetModules();
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

const makeFile = (overrides: Partial<File> = {}, content = "fake-image-bytes"): File => {
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

const mockSuccessfulUpload = () => {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({
      public_id: "ak12/my-photo",
      secure_url: "https://res.cloudinary.com/cloud-test/image/upload/ak12/my-photo.png",
    }),
  });
};

const mockSuccessfulDelete = () => {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({
      result: "ok",
    }),
  });
};

describe("cloudinaryStorage", () => {
  describe("uploadImage", () => {
    it("uploads an image and returns stored image data", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      mockSuccessfulUpload();

      const result = await cloudinaryStorage.uploadImage({
        file: makeFile({
          type: "image/png",
          size: 2048,
        }),
        fileName: "My Photo!",
      });

      expect(result).toEqual({
        publicId: "ak12/my-photo",
        secureUrl: "https://res.cloudinary.com/cloud-test/image/upload/ak12/my-photo.png",
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("sends upload request to the correct Cloudinary endpoint", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      mockSuccessfulUpload();

      await cloudinaryStorage.uploadImage({
        file: makeFile(),
        fileName: "photo",
      });

      const [url, options] = fetchMock.mock.calls[0];

      expect(url).toBe("https://api.cloudinary.com/v1_1/cloud-test/image/upload");
      expect(options.method).toBe("POST");
      expect(options.cache).toBe("no-store");
    });

    it("sends required upload parameters", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      mockSuccessfulUpload();

      await cloudinaryStorage.uploadImage({
        file: makeFile(),
        fileName: "My Photo!",
      });

      const [, options] = fetchMock.mock.calls[0];
      const formData = options.body as FormData;

      expect(formData.get("file")).toBeDefined();
      expect(formData.get("api_key")).toBe("key-123");
      expect(formData.get("folder")).toBe("ak12");
      expect(formData.get("public_id")).toBe("My-Photo");
      expect(formData.get("overwrite")).toBe("true");
      expect(formData.get("invalidate")).toBe("true");
    });

    it("generates a valid signature and timestamp", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      mockSuccessfulUpload();

      await cloudinaryStorage.uploadImage({
        file: makeFile(),
        fileName: "photo",
      });

      const [, options] = fetchMock.mock.calls[0];
      const formData = options.body as FormData;

      const signature = formData.get("signature");
      const timestamp = formData.get("timestamp");

      expect(signature).toMatch(/^[a-f0-9]{64}$/);
      expect(timestamp).toMatch(/^\d+$/);
    });

    it("sanitizes the file name before sending public_id", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      mockSuccessfulUpload();

      await cloudinaryStorage.uploadImage({
        file: makeFile(),
        fileName: "My Photo! @#$%",
      });

      const [, options] = fetchMock.mock.calls[0];
      const formData = options.body as FormData;

      expect(formData.get("public_id")).toBe("My-Photo");
    });

    it("rejects unsupported file types before making a request", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      await expect(
        cloudinaryStorage.uploadImage({
          file: makeFile({
            type: "application/pdf",
          }),
          fileName: "document",
        }),
      ).rejects.toThrow(/JPG, JPEG, PNG, WEBP/);

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects files larger than 5 MB before making a request", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      await expect(
        cloudinaryStorage.uploadImage({
          file: makeFile({
            type: "image/png",
            size: 5 * 1024 * 1024 + 1,
          }),
          fileName: "large-image",
        }),
      ).rejects.toThrow(/5 MB/);

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects empty file names before making a request", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      await expect(
        cloudinaryStorage.uploadImage({
          file: makeFile(),
          fileName: "   ",
        }),
      ).rejects.toThrow(/Назва файлу/);

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("throws when Cloudinary returns an error", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      fetchMock.mockResolvedValue({
        ok: false,
        json: async () => ({
          error: {
            message: "Invalid signature",
          },
        }),
      });

      await expect(
        cloudinaryStorage.uploadImage({
          file: makeFile(),
          fileName: "photo",
        }),
      ).rejects.toThrow("Invalid signature");
    });

    it("throws a generic error when Cloudinary does not provide an error message", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      fetchMock.mockResolvedValue({
        ok: false,
        json: async () => ({
          error: {},
        }),
      });

      await expect(
        cloudinaryStorage.uploadImage({
          file: makeFile(),
          fileName: "photo",
        }),
      ).rejects.toThrow("Не вдалося завантажити зображення");
    });

    it("throws when Cloudinary configuration is incomplete", async () => {
      delete process.env.CLOUDINARY_API_KEY;

      jest.resetModules();

      const { cloudinaryStorage } = require("./cloudinary.client");

      await expect(
        cloudinaryStorage.uploadImage({
          file: makeFile(),
          fileName: "photo",
        }),
      ).rejects.toThrow(/змінні середовища/);

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("deleteImage", () => {
    it("deletes an image from Cloudinary", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      mockSuccessfulDelete();

      await expect(cloudinaryStorage.deleteImage("ak12/photo")).resolves.toBeUndefined();

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("sends delete request to the correct Cloudinary endpoint", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      mockSuccessfulDelete();

      await cloudinaryStorage.deleteImage("ak12/photo");

      const [url, options] = fetchMock.mock.calls[0];

      expect(url).toBe("https://api.cloudinary.com/v1_1/cloud-test/image/destroy");
      expect(options.method).toBe("POST");
      expect(options.cache).toBe("no-store");
    });

    it("sends required delete parameters", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      mockSuccessfulDelete();

      await cloudinaryStorage.deleteImage("ak12/my-photo");

      const [, options] = fetchMock.mock.calls[0];
      const formData = options.body as FormData;

      expect(formData.get("public_id")).toBe("ak12/my-photo");
      expect(formData.get("api_key")).toBe("key-123");
      expect(formData.get("invalidate")).toBe("true");
      expect(formData.get("signature")).toMatch(/^[a-f0-9]{64}$/);
      expect(formData.get("timestamp")).toMatch(/^\d+$/);
    });

    it("throws when Cloudinary returns an error", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      fetchMock.mockResolvedValue({
        ok: false,
        json: async () => ({
          error: {
            message: "Not found",
          },
        }),
      });

      await expect(cloudinaryStorage.deleteImage("ak12/nonexistent")).rejects.toThrow("Not found");
    });

    it("throws a generic error when Cloudinary does not provide an error message", async () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      fetchMock.mockResolvedValue({
        ok: false,
        json: async () => ({
          error: {},
        }),
      });

      await expect(cloudinaryStorage.deleteImage("ak12/photo")).rejects.toThrow("Не вдалося видалити зображення");
    });

    it("throws when Cloudinary configuration is incomplete", async () => {
      delete process.env.CLOUDINARY_API_KEY;

      jest.resetModules();

      const { cloudinaryStorage } = require("./cloudinary.client");

      await expect(cloudinaryStorage.deleteImage("ak12/photo")).rejects.toThrow(/змінні середовища/);

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("getImageUrl", () => {
    it("returns the Cloudinary URL for an image", () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      const result = cloudinaryStorage.getImageUrl("Background.png");

      expect(result).toBe("https://res.cloudinary.com/cloud-test/image/upload/ak12/Background.png");
    });

    it("returns undefined when the file name is empty", () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      expect(cloudinaryStorage.getImageUrl("")).toBeUndefined();
    });

    it("returns undefined when the file name is missing", () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      expect(cloudinaryStorage.getImageUrl(undefined as unknown as string)).toBeUndefined();
    });

    it("uses the configured Cloudinary folder", () => {
      process.env.CLOUDINARY_MEDIA_FOLDER = "custom-folder";

      jest.resetModules();

      const { cloudinaryStorage } = require("./cloudinary.client");

      expect(cloudinaryStorage.getImageUrl("Background.png")).toBe(
        "https://res.cloudinary.com/cloud-test/image/upload/custom-folder/Background.png",
      );
    });

    it("throws when Cloudinary configuration is incomplete", () => {
      delete process.env.CLOUDINARY_API_KEY;

      jest.resetModules();

      const { cloudinaryStorage } = require("./cloudinary.client");

      expect(() => cloudinaryStorage.getImageUrl("Background.png")).toThrow(/змінні середовища/);
    });
  });

  describe("ImageStorage interface", () => {
    it("exposes uploadImage, deleteImage and getImageUrl methods", () => {
      const { cloudinaryStorage } = require("./cloudinary.client");

      expect(cloudinaryStorage).toBeDefined();
      expect(typeof cloudinaryStorage.uploadImage).toBe("function");
      expect(typeof cloudinaryStorage.deleteImage).toBe("function");
      expect(typeof cloudinaryStorage.getImageUrl).toBe("function");
    });
  });
});

export {};
