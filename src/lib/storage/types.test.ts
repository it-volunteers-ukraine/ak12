import type { ImageStorage, StoredImage } from "./types";

describe("ImageStorage interface contract", () => {
  describe("StoredImage type", () => {
    it("defines publicId property as string", () => {
      const storedImage: StoredImage = {
        publicId: "test-id",
        secureUrl: "https://example.com/image",
      };

      expect(typeof storedImage.publicId).toBe("string");
    });

    it("defines secureUrl property as string", () => {
      const storedImage: StoredImage = {
        publicId: "test-id",
        secureUrl: "https://example.com/image",
      };

      expect(typeof storedImage.secureUrl).toBe("string");
    });

    it("requires both publicId and secureUrl properties", () => {
      const storedImage: StoredImage = {
        publicId: "id",
        secureUrl: "url",
      };

      expect(Object.keys(storedImage)).toContain("publicId");
      expect(Object.keys(storedImage)).toContain("secureUrl");
    });
  });

  describe("ImageStorage interface", () => {
    let mockStorage: ImageStorage;

    beforeEach(() => {
      mockStorage = {
        uploadImage: jest.fn().mockResolvedValue({
          publicId: "test-id",
          secureUrl: "https://example.com/image",
        }),
        deleteImage: jest.fn().mockResolvedValue(undefined),
        getImageUrl: jest.fn().mockReturnValue("https://example.com/image"),
      };
    });

    describe("uploadImage method", () => {
      it("accepts params object with file and fileName", async () => {
        const file = new File(["content"], "test.png", {
          type: "image/png",
        });

        await mockStorage.uploadImage({
          file,
          fileName: "test",
        });

        expect(mockStorage.uploadImage).toHaveBeenCalledWith(
          expect.objectContaining({
            file: expect.any(File),
            fileName: "test",
          }),
        );
      });

      it("returns Promise<StoredImage>", async () => {
        const result = await mockStorage.uploadImage({
          file: new File(["content"], "test.png", {
            type: "image/png",
          }),
          fileName: "test",
        });

        expect(result).toHaveProperty("publicId");
        expect(result).toHaveProperty("secureUrl");
      });

      it("returns object with publicId as string", async () => {
        const result = await mockStorage.uploadImage({
          file: new File(["content"], "test.png", {
            type: "image/png",
          }),
          fileName: "test",
        });

        expect(typeof result.publicId).toBe("string");
      });

      it("returns object with secureUrl as string", async () => {
        const result = await mockStorage.uploadImage({
          file: new File(["content"], "test.png", {
            type: "image/png",
          }),
          fileName: "test",
        });

        expect(typeof result.secureUrl).toBe("string");
      });

      it("returns non-empty publicId", async () => {
        const result = await mockStorage.uploadImage({
          file: new File(["content"], "test.png", {
            type: "image/png",
          }),
          fileName: "test",
        });

        expect(result.publicId.length).toBeGreaterThan(0);
      });

      it("returns non-empty secureUrl", async () => {
        const result = await mockStorage.uploadImage({
          file: new File(["content"], "test.png", {
            type: "image/png",
          }),
          fileName: "test",
        });

        expect(result.secureUrl.length).toBeGreaterThan(0);
      });

      it("throws on validation errors (contract expectation)", async () => {
        const validationError = new Error("Invalid file");

        (mockStorage.uploadImage as jest.Mock).mockRejectedValueOnce(validationError);

        await expect(
          mockStorage.uploadImage({
            file: new File(["content"], "test.pdf", {
              type: "application/pdf",
            }),
            fileName: "test",
          }),
        ).rejects.toThrow("Invalid file");
      });
    });

    describe("deleteImage method", () => {
      it("accepts publicId as string parameter", async () => {
        await mockStorage.deleteImage("test-public-id");

        expect(mockStorage.deleteImage).toHaveBeenCalledWith("test-public-id");
      });

      it("returns Promise<void>", async () => {
        const result = await mockStorage.deleteImage("test-id");

        expect(result).toBeUndefined();
      });

      it("can be called multiple times", async () => {
        await mockStorage.deleteImage("id-1");
        await mockStorage.deleteImage("id-2");

        expect(mockStorage.deleteImage).toHaveBeenCalledTimes(2);
      });

      it("throws on deletion errors (contract expectation)", async () => {
        const deletionError = new Error("Not found");

        (mockStorage.deleteImage as jest.Mock).mockRejectedValueOnce(deletionError);

        await expect(mockStorage.deleteImage("nonexistent-id")).rejects.toThrow("Not found");
      });
    });

    describe("getImageUrl method", () => {
      it("accepts fileName as string parameter", () => {
        const result = mockStorage.getImageUrl("photo.png");

        expect(mockStorage.getImageUrl).toHaveBeenCalledWith("photo.png");
        expect(result).toBe("https://example.com/image");
      });

      it("returns image URL when image exists", () => {
        const result = mockStorage.getImageUrl("photo.png");

        expect(result).toBe("https://example.com/image");
      });

      it("can return undefined when image URL is unavailable", () => {
        (mockStorage.getImageUrl as jest.Mock).mockReturnValueOnce(undefined);

        const result = mockStorage.getImageUrl("missing.png");

        expect(result).toBeUndefined();
      });

      it("can be called multiple times", () => {
        const getImageUrlMock = jest.fn().mockReturnValue("https://example.com/image");

        mockStorage.getImageUrl = getImageUrlMock;

        mockStorage.getImageUrl("image-1.png");
        mockStorage.getImageUrl("image-2.png");

        expect(getImageUrlMock).toHaveBeenCalledTimes(2);
        expect(getImageUrlMock).toHaveBeenNthCalledWith(1, "image-1.png");
        expect(getImageUrlMock).toHaveBeenNthCalledWith(2, "image-2.png");
      });
    });

    describe("interface completeness", () => {
      it("has exactly three methods: uploadImage, deleteImage and getImageUrl", () => {
        const methods = Object.keys(mockStorage).filter(
          (key) => typeof mockStorage[key as keyof ImageStorage] === "function",
        );

        expect(methods).toHaveLength(3);
        expect(methods).toContain("uploadImage");
        expect(methods).toContain("deleteImage");
        expect(methods).toContain("getImageUrl");
      });

      it("uploadImage method is callable with required parameters", async () => {
        const file = new File(["content"], "test.png", {
          type: "image/png",
        });

        await mockStorage.uploadImage({
          file,
          fileName: "test",
        });

        expect(mockStorage.uploadImage).toHaveBeenCalled();
      });

      it("deleteImage method is callable with required parameters", async () => {
        await mockStorage.deleteImage("test-id");

        expect(mockStorage.deleteImage).toHaveBeenCalled();
      });

      it("getImageUrl method is callable with required parameters", () => {
        const result = mockStorage.getImageUrl("test.png");

        expect(mockStorage.getImageUrl).toHaveBeenCalledWith("test.png");
        expect(result).toBe("https://example.com/image");
      });
    });
  });

  describe("concurrent uploads consistency", () => {
    it("different upload calls return different publicIds", async () => {
      const mockStorage: ImageStorage = {
        uploadImage: jest
          .fn()
          .mockResolvedValueOnce({
            publicId: "id-1",
            secureUrl: "url-1",
          })
          .mockResolvedValueOnce({
            publicId: "id-2",
            secureUrl: "url-2",
          }),
        deleteImage: jest.fn().mockResolvedValue(undefined),
        getImageUrl: jest.fn().mockReturnValue("https://example.com/image"),
      };

      const file = new File(["content"], "test.png", {
        type: "image/png",
      });

      const result1 = await mockStorage.uploadImage({
        file,
        fileName: "test",
      });

      const result2 = await mockStorage.uploadImage({
        file,
        fileName: "test",
      });

      expect(result1.publicId).not.toBe(result2.publicId);
    });
  });
});
