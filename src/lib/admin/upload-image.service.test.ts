import { deleteImage, uploadImage } from "./upload-image.service";

const mockUploadImage = jest.fn();
const mockDeleteImage = jest.fn();

jest.mock("@/lib/storage", () => ({
  getStorage: jest.fn(() => ({
    uploadImage: mockUploadImage,
    deleteImage: mockDeleteImage,
  })),
}));

describe("uploadImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delegate uploadImage to the configured storage", async () => {
    const params = {
      file: new File(["image"], "photo.png", { type: "image/png" }),
      fileName: "photo",
    };

    const result = {
      publicId: "photo-123",
      secureUrl: "https://example.com/photo-123.png",
    };

    mockUploadImage.mockResolvedValue(result);

    await expect(uploadImage(params)).resolves.toEqual(result);

    expect(mockUploadImage).toHaveBeenCalledTimes(1);
    expect(mockUploadImage).toHaveBeenCalledWith(params);
  });

  it("should propagate storage upload errors", async () => {
    const error = new Error("Storage upload failed");

    mockUploadImage.mockRejectedValue(error);

    const params = {
      file: new File(["image"], "photo.png", { type: "image/png" }),
      fileName: "photo",
    };

    await expect(uploadImage(params)).rejects.toThrow("Storage upload failed");

    expect(mockUploadImage).toHaveBeenCalledWith(params);
  });
});

describe("deleteImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delegate deleteImage to the configured storage", async () => {
    const result = { result: "ok" };

    mockDeleteImage.mockResolvedValue(result);

    await expect(deleteImage("ak12/my-photo")).resolves.toEqual(result);

    expect(mockDeleteImage).toHaveBeenCalledTimes(1);
    expect(mockDeleteImage).toHaveBeenCalledWith("ak12/my-photo");
  });

  it("should propagate storage delete errors", async () => {
    const error = new Error("Storage delete failed");

    mockDeleteImage.mockRejectedValue(error);

    await expect(deleteImage("ak12/missing")).rejects.toThrow("Storage delete failed");

    expect(mockDeleteImage).toHaveBeenCalledWith("ak12/missing");
  });
});
