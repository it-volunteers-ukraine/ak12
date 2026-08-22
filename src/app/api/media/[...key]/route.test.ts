/**
 * @jest-environment node
 */

import { Readable } from "node:stream";
import { NextRequest } from "next/server";

const originalEnv = { ...process.env };

const mockGetMinioClient = jest.fn();

jest.mock("@/lib/storage/minio.client", () => ({
  getMinioClient: mockGetMinioClient,
}));

beforeEach(() => {
  process.env = {
    ...originalEnv,
    STORAGE_BUCKET: "test-bucket",
    STORAGE_MEDIA_FOLDER: "ak12",
  };

  jest.clearAllMocks();
});

afterAll(() => {
  process.env = originalEnv;
});

describe("GET /api/media/[...key]", () => {
  it("returns 404 when object key is outside the media folder", async () => {
    const { GET } = await import("./route");

    const request = new NextRequest("http://localhost:3000/api/media/private/secret.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({
        key: ["private", "secret.jpg"],
      }),
    });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Requested media file was not found");
    expect(mockGetMinioClient).not.toHaveBeenCalled();
  });

  it("returns 500 when STORAGE_BUCKET is not configured", async () => {
    delete process.env.STORAGE_BUCKET;

    const { GET } = await import("./route");

    const request = new NextRequest("http://localhost:3000/api/media/test.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({
        key: ["test.jpg"],
      }),
    });

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Storage is not configured");
    expect(mockGetMinioClient).not.toHaveBeenCalled();
  });

  it("returns image from MinIO", async () => {
    const nodeStream = Readable.from([Buffer.from("image-data")]);

    const statObjectMock = jest.fn().mockResolvedValue({
      metaData: {
        "content-type": "image/jpeg",
      },
    });

    const getObjectMock = jest.fn().mockResolvedValue(nodeStream);

    mockGetMinioClient.mockReturnValue({
      statObject: statObjectMock,
      getObject: getObjectMock,
    });

    const { GET } = await import("./route");

    const request = new NextRequest("http://localhost:3000/api/media/ak12/photo.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({
        key: ["ak12", "photo.jpg"],
      }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=31536000, immutable");
    expect(statObjectMock).toHaveBeenCalledWith("test-bucket", "ak12/photo.jpg");
    expect(getObjectMock).toHaveBeenCalledWith("test-bucket", "ak12/photo.jpg");
  });

  it("joins multi-segment key with forward slashes", async () => {
    const statObjectMock = jest.fn().mockResolvedValue({
      metaData: {
        "content-type": "image/png",
      },
    });

    const getObjectMock = jest.fn().mockResolvedValue(Readable.from(["image-data"]));

    mockGetMinioClient.mockReturnValue({
      statObject: statObjectMock,
      getObject: getObjectMock,
    });

    const { GET } = await import("./route");

    const request = new NextRequest("http://localhost:3000/api/media/ak12/uploads/2024/photo.png", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({
        key: ["ak12", "uploads", "2024", "photo.png"],
      }),
    });

    expect(response.status).toBe(200);
    expect(statObjectMock).toHaveBeenCalledWith("test-bucket", "ak12/uploads/2024/photo.png");
    expect(getObjectMock).toHaveBeenCalledWith("test-bucket", "ak12/uploads/2024/photo.png");
  });

  it("uses application/octet-stream when Content-Type is missing", async () => {
    const statObjectMock = jest.fn().mockResolvedValue({
      metaData: {},
    });

    const getObjectMock = jest.fn().mockResolvedValue(Readable.from(["file-data"]));

    mockGetMinioClient.mockReturnValue({
      statObject: statObjectMock,
      getObject: getObjectMock,
    });

    const { GET } = await import("./route");

    const request = new NextRequest("http://localhost:3000/api/media/ak12/file.bin", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({
        key: ["ak12", "file.bin"],
      }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/octet-stream");
  });

  it("returns 404 when object does not exist", async () => {
    const notFoundError = Object.assign(new Error("Not found"), {
      code: "NotFound",
    });

    const statObjectMock = jest.fn().mockRejectedValue(notFoundError);
    const getObjectMock = jest.fn();

    mockGetMinioClient.mockReturnValue({
      statObject: statObjectMock,
      getObject: getObjectMock,
    });

    const { GET } = await import("./route");

    const request = new NextRequest("http://localhost:3000/api/media/ak12/nonexistent.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({
        key: ["ak12", "nonexistent.jpg"],
      }),
    });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Requested media file was not found");
    expect(getObjectMock).not.toHaveBeenCalled();
  });

  it("throws when MinIO returns an unexpected error", async () => {
    const error = new Error("Access denied");

    const statObjectMock = jest.fn().mockRejectedValue(error);

    mockGetMinioClient.mockReturnValue({
      statObject: statObjectMock,
      getObject: jest.fn(),
    });

    const { GET } = await import("./route");

    const request = new NextRequest("http://localhost:3000/api/media/ak12/forbidden.jpg", {
      method: "GET",
    });

    await expect(
      GET(request, {
        params: Promise.resolve({
          key: ["ak12", "forbidden.jpg"],
        }),
      }),
    ).rejects.toThrow("Access denied");
  });

  it("preserves Content-Type from MinIO metadata", async () => {
    const contentTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf", "video/mp4"];

    for (const contentType of contentTypes) {
      jest.clearAllMocks();

      const statObjectMock = jest.fn().mockResolvedValue({
        metaData: {
          "content-type": contentType,
        },
      });

      const getObjectMock = jest.fn().mockResolvedValue(Readable.from(["file-data"]));

      mockGetMinioClient.mockReturnValue({
        statObject: statObjectMock,
        getObject: getObjectMock,
      });

      const { GET } = await import("./route");

      const request = new NextRequest("http://localhost:3000/api/media/ak12/file", {
        method: "GET",
      });

      const response = await GET(request, {
        params: Promise.resolve({
          key: ["ak12", "file"],
        }),
      });

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe(contentType);
    }
  });

  it("returns response with object body", async () => {
    const getObjectMock = jest.fn().mockResolvedValue(Readable.from(["image-data"]));

    const statObjectMock = jest.fn().mockResolvedValue({
      metaData: {
        "content-type": "image/jpeg",
      },
    });

    mockGetMinioClient.mockReturnValue({
      statObject: statObjectMock,
      getObject: getObjectMock,
    });

    const { GET } = await import("./route");

    const request = new NextRequest("http://localhost:3000/api/media/ak12/photo.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({
        key: ["ak12", "photo.jpg"],
      }),
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});
