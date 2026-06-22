/**
 * @jest-environment node
 */
import { uploadImage, deleteImage, validateImageFile } from "@/lib/admin/upload-image.service";

const ORIGINAL_ENV = { ...process.env };
const fetchMock = jest.fn();

beforeAll(() => {
  global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    CLOUDINARY_CLOUD_NAME: "cloud-test",
    CLOUDINARY_API_KEY: "key-123",
    CLOUDINARY_API_SECRET: "supersecret",
    CLOUDINARY_MEDIA_FOLDER: "ak12",
  };
  fetchMock.mockReset();
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

const makeFile = (overrides: Partial<File> = {}, content = "fake-image-bytes") => {
  const baseSize = content.length;
  const base = new File([content], "photo.png", { type: "image/png" });

  return Object.defineProperties(base, {
    type: { value: overrides.type ?? base.type, configurable: true },
    size: { value: overrides.size ?? baseSize, configurable: true },
  }) as File;
};

describe("validateImageFile", () => {
  it("should accept a PNG file under the size limit", async () => {
    await expect(validateImageFile(makeFile({ type: "image/png", size: 1024 }))).resolves.toBeUndefined();
  });

  it.each(["image/jpeg", "image/jpg", "image/png", "image/webp"])("should accept the allowed type %s", async (type) => {
    await expect(validateImageFile(makeFile({ type, size: 1024 }))).resolves.toBeUndefined();
  });

  it("should reject a non-image MIME type", async () => {
    await expect(validateImageFile(makeFile({ type: "application/pdf", size: 1024 }))).rejects.toThrow(
      /JPG, JPEG, PNG, WEBP/,
    );
  });

  it("should reject a file larger than 5 MB", async () => {
    await expect(validateImageFile(makeFile({ type: "image/png", size: 5 * 1024 * 1024 + 1 }))).rejects.toThrow(/5 MB/);
  });
});

describe("uploadImage", () => {
  it("should POST to cloudinary with a signed FormData and return the public id and secure url", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        public_id: "ak12/my-photo",
        secure_url: "https://res.cloudinary.com/cloud-test/image/upload/ak12/my-photo.png",
      }),
    });

    const result = await uploadImage({
      file: makeFile({ type: "image/png", size: 2048 }),
      fileName: "My Photo!",
    });

    expect(result).toEqual({
      publicId: "ak12/my-photo",
      secureUrl: "https://res.cloudinary.com/cloud-test/image/upload/ak12/my-photo.png",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toBe("https://api.cloudinary.com/v1_1/cloud-test/image/upload");
    expect(init).toEqual(
      expect.objectContaining({
        method: "POST",
        cache: "no-store",
        body: expect.any(FormData),
      }),
    );

    const formData = init.body as FormData;

    expect(formData.get("api_key")).toBe("key-123");
    expect(formData.get("folder")).toBe("ak12");
    expect(formData.get("public_id")).toBe("My-Photo");
    expect(formData.get("overwrite")).toBe("true");
    expect(formData.get("invalidate")).toBe("true");
    expect(formData.get("signature")).toMatch(/^[a-f0-9]{64}$/);
    expect(typeof formData.get("timestamp")).toBe("string");
  });

  it("should throw when cloudinary returns a non-ok response with an error message", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: "Invalid signature" } }),
    });

    await expect(
      uploadImage({
        file: makeFile({ type: "image/png", size: 2048 }),
        fileName: "photo",
      }),
    ).rejects.toThrow("Invalid signature");
  });

  it("should throw when required cloudinary env vars are missing", async () => {
    delete process.env.CLOUDINARY_API_SECRET;

    await expect(
      uploadImage({
        file: makeFile({ type: "image/png", size: 2048 }),
        fileName: "photo",
      }),
    ).rejects.toThrow(/змінні середовища/);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should reject an empty file name", async () => {
    await expect(
      uploadImage({
        file: makeFile({ type: "image/png", size: 2048 }),
        fileName: "   ",
      }),
    ).rejects.toThrow(/Назва файлу/);
  });
});

describe("deleteImage", () => {
  it("should POST to cloudinary destroy endpoint with the public id and a signature", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ result: "ok" }),
    });

    const result = await deleteImage("ak12/my-photo");

    expect(result).toEqual({ result: "ok" });

    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toBe("https://api.cloudinary.com/v1_1/cloud-test/image/destroy");

    const formData = init.body as FormData;

    expect(formData.get("public_id")).toBe("ak12/my-photo");
    expect(formData.get("invalidate")).toBe("true");
    expect(formData.get("api_key")).toBe("key-123");
    expect(formData.get("signature")).toMatch(/^[a-f0-9]{64}$/);
  });

  it("should throw when cloudinary returns a non-ok response", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: "Not found" } }),
    });

    await expect(deleteImage("missing")).rejects.toThrow("Not found");
  });
});
