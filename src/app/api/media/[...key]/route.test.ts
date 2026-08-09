/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

const originalEnv = { ...process.env };

jest.mock("@aws-sdk/client-s3");
jest.mock("@/lib/storage/s3-client");

beforeEach(() => {
  process.env = { ...originalEnv };
  jest.clearAllMocks();
});

afterAll(() => {
  process.env = originalEnv;
});

describe("GET /api/media/[...key]", () => {
  it("should return 500 when STORAGE_BUCKET is not configured", async () => {
    delete process.env.STORAGE_BUCKET;

    const { GET } = require("./route");

    const request = new NextRequest("http://localhost:3000/api/media/test.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({ key: ["test.jpg"] }),
    });

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Bucket is not configured");
  });

  it("should retrieve object from S3 with single-segment key", async () => {
    process.env.STORAGE_BUCKET = "test-bucket";

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("image-data"));
        controller.close();
      },
    });

    const { getS3Client } = require("@/lib/storage/s3-client");

    jest.mocked(getS3Client).mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Body: { transformToWebStream: jest.fn().mockReturnValue(mockStream) },
        ContentType: "image/jpeg",
      }),
    });

    const { GET } = require("./route");

    const request = new NextRequest("http://localhost:3000/api/media/photo.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({ key: ["photo.jpg"] }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("should retrieve object from S3 with multi-segment key", async () => {
    process.env.STORAGE_BUCKET = "test-bucket";

    const mockStream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    const { getS3Client } = require("@/lib/storage/s3-client");
    const mockSend = jest.fn().mockResolvedValue({
      Body: { transformToWebStream: jest.fn().mockReturnValue(mockStream) },
      ContentType: "image/png",
    });

    jest.mocked(getS3Client).mockReturnValue({
      send: mockSend,
    });

    const { GET } = require("./route");

    const request = new NextRequest("http://localhost:3000/api/media/uploads/2024/photo.png", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({ key: ["uploads", "2024", "photo.png"] }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("should use application/octet-stream when ContentType is missing", async () => {
    process.env.STORAGE_BUCKET = "test-bucket";

    const mockStream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    const { getS3Client } = require("@/lib/storage/s3-client");

    jest.mocked(getS3Client).mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Body: { transformToWebStream: jest.fn().mockReturnValue(mockStream) },
        ContentType: undefined,
      }),
    });

    const { GET } = require("./route");

    const request = new NextRequest("http://localhost:3000/api/media/file.bin", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({ key: ["file.bin"] }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/octet-stream");
  });

  it("should return 404 when object does not exist in S3", async () => {
    process.env.STORAGE_BUCKET = "test-bucket";

    const { getS3Client } = require("@/lib/storage/s3-client");

    jest.mocked(getS3Client).mockReturnValue({
      send: jest.fn().mockRejectedValue(new Error("NoSuchKey")),
    });

    const { GET } = require("./route");

    const request = new NextRequest("http://localhost:3000/api/media/nonexistent.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({ key: ["nonexistent.jpg"] }),
    });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not found");
  });

  it("should return 404 on any S3 error", async () => {
    process.env.STORAGE_BUCKET = "test-bucket";

    const { getS3Client } = require("@/lib/storage/s3-client");

    jest.mocked(getS3Client).mockReturnValue({
      send: jest.fn().mockRejectedValue(new Error("AccessDenied")),
    });

    const { GET } = require("./route");

    const request = new NextRequest("http://localhost:3000/api/media/forbidden.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({ key: ["forbidden.jpg"] }),
    });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not found");
  });

  it("should set Cache-Control to no-store", async () => {
    process.env.STORAGE_BUCKET = "test-bucket";

    const mockStream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    const { getS3Client } = require("@/lib/storage/s3-client");

    jest.mocked(getS3Client).mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Body: { transformToWebStream: jest.fn().mockReturnValue(mockStream) },
        ContentType: "image/webp",
      }),
    });

    const { GET } = require("./route");

    const request = new NextRequest("http://localhost:3000/api/media/cached.webp", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({ key: ["cached.webp"] }),
    });

    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("should handle empty key", async () => {
    process.env.STORAGE_BUCKET = "test-bucket";

    const mockStream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    const { getS3Client } = require("@/lib/storage/s3-client");
    const mockSend = jest.fn().mockResolvedValue({
      Body: { transformToWebStream: jest.fn().mockReturnValue(mockStream) },
      ContentType: "image/jpeg",
    });

    jest.mocked(getS3Client).mockReturnValue({
      send: mockSend,
    });

    const { GET } = require("./route");

    const request = new NextRequest("http://localhost:3000/api/media/", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({ key: [""] }),
    });

    expect(response.status).toBe(200);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("should preserve ContentType from S3 response for various file types", async () => {
    process.env.STORAGE_BUCKET = "test-bucket";

    const contentTypes = [
      { type: "image/jpeg" },
      { type: "image/png" },
      { type: "image/webp" },
      { type: "application/pdf" },
      { type: "video/mp4" },
    ];

    for (const { type } of contentTypes) {
      jest.clearAllMocks();

      const mockStream = new ReadableStream({
        start(controller) {
          controller.close();
        },
      });

      const { getS3Client } = require("@/lib/storage/s3-client");

      jest.mocked(getS3Client).mockReturnValue({
        send: jest.fn().mockResolvedValue({
          Body: { transformToWebStream: jest.fn().mockReturnValue(mockStream) },
          ContentType: type,
        }),
      });

      const { GET } = require("./route");

      const request = new NextRequest(`http://localhost:3000/api/media/file`, {
        method: "GET",
      });

      const response = await GET(request, {
        params: Promise.resolve({ key: ["file"] }),
      });

      expect(response.headers.get("Content-Type")).toBe(type);
    }
  });

  it("should join multi-segment key with forward slashes", async () => {
    process.env.STORAGE_BUCKET = "test-bucket";

    const mockStream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    const { getS3Client } = require("@/lib/storage/s3-client");
    const mockSend = jest.fn().mockResolvedValue({
      Body: { transformToWebStream: jest.fn().mockReturnValue(mockStream) },
      ContentType: "image/jpeg",
    });

    jest.mocked(getS3Client).mockReturnValue({
      send: mockSend,
    });

    const { GET } = require("./route");

    const request = new NextRequest("http://localhost:3000/api/media/a/b/c/d.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({ key: ["a", "b", "c", "d.jpg"] }),
    });

    expect(response.status).toBe(200);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("should return response with Body stream", async () => {
    process.env.STORAGE_BUCKET = "test-bucket";

    const mockStream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    const { getS3Client } = require("@/lib/storage/s3-client");

    jest.mocked(getS3Client).mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Body: { transformToWebStream: jest.fn().mockReturnValue(mockStream) },
        ContentType: "image/jpeg",
      }),
    });

    const { GET } = require("./route");

    const request = new NextRequest("http://localhost:3000/api/media/photo.jpg", {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({ key: ["photo.jpg"] }),
    });

    expect(response.body).toBeDefined();
    expect(response.status).toBe(200);
  });
});
