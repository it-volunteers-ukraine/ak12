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
  };

  jest.clearAllMocks();
});

afterAll(() => {
  process.env = originalEnv;
});

describe("GET /api/media/[...key]", () => {
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
    expect(await response.text()).toBe("Bucket is not configured");

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

    const request = new NextRequest("http://localhost:3000/api/media/photo.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({
        key: ["photo.jpg"],
      }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
    expect(response.headers.get("Cache-Control")).toBe("no-store");

    expect(statObjectMock).toHaveBeenCalledWith("test-bucket", "photo.jpg");

    expect(getObjectMock).toHaveBeenCalledWith("test-bucket", "photo.jpg");
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

    const request = new NextRequest("http://localhost:3000/api/media/uploads/2024/photo.png", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({
        key: ["uploads", "2024", "photo.png"],
      }),
    });

    expect(response.status).toBe(200);

    expect(statObjectMock).toHaveBeenCalledWith("test-bucket", "uploads/2024/photo.png");

    expect(getObjectMock).toHaveBeenCalledWith("test-bucket", "uploads/2024/photo.png");
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

    const request = new NextRequest("http://localhost:3000/api/media/file.bin", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({
        key: ["file.bin"],
      }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/octet-stream");
  });

  it("returns 404 when object does not exist", async () => {
    const statObjectMock = jest.fn().mockRejectedValue(new Error("Not found"));

    const getObjectMock = jest.fn();

    mockGetMinioClient.mockReturnValue({
      statObject: statObjectMock,
      getObject: getObjectMock,
    });

    const { GET } = await import("./route");

    const request = new NextRequest("http://localhost:3000/api/media/nonexistent.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({
        key: ["nonexistent.jpg"],
      }),
    });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not found");

    expect(getObjectMock).not.toHaveBeenCalled();
  });

  it("returns 404 when MinIO returns an error", async () => {
    const statObjectMock = jest.fn().mockRejectedValue(new Error("Access denied"));

    mockGetMinioClient.mockReturnValue({
      statObject: statObjectMock,
      getObject: jest.fn(),
    });

    const { GET } = await import("./route");

    const request = new NextRequest("http://localhost:3000/api/media/forbidden.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({
        key: ["forbidden.jpg"],
      }),
    });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not found");
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

      const request = new NextRequest("http://localhost:3000/api/media/file", {
        method: "GET",
      });

      const response = await GET(request, {
        params: Promise.resolve({
          key: ["file"],
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

    const request = new NextRequest("http://localhost:3000/api/media/photo.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({
        key: ["photo.jpg"],
      }),
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});
