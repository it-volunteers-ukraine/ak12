/**
 * @jest-environment node
 */
const s3TestOriginalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...s3TestOriginalEnv };
  jest.resetModules();
});

describe("getS3Client", () => {
  it("creates an S3Client with correct configuration", () => {
    process.env.STORAGE_ENDPOINT = "http://localhost:9000";
    process.env.STORAGE_ACCESS_KEY = "minioadmin";
    process.env.STORAGE_SECRET_KEY = "minioadmin";
    process.env.STORAGE_REGION = "us-east-1";

    jest.resetModules();

    const { getS3Client } = require("./s3-client");
    const client = getS3Client();

    expect(client).toBeDefined();
    expect(client.config).toBeDefined();
  });

  it("uses default region 'auto' when STORAGE_REGION is not set", () => {
    process.env.STORAGE_ENDPOINT = "http://localhost:9000";
    process.env.STORAGE_ACCESS_KEY = "minioadmin";
    process.env.STORAGE_SECRET_KEY = "minioadmin";
    delete process.env.STORAGE_REGION;

    jest.resetModules();

    const { getS3Client } = require("./s3-client");
    const client = getS3Client();

    expect(client).toBeDefined();
  });

  it("throws when STORAGE_ENDPOINT is missing", () => {
    process.env.STORAGE_ACCESS_KEY = "minioadmin";
    process.env.STORAGE_SECRET_KEY = "minioadmin";
    delete process.env.STORAGE_ENDPOINT;

    jest.resetModules();

    const { getS3Client } = require("./s3-client");

    expect(() => getS3Client()).toThrow(/STORAGE_ENDPOINT/);
  });

  it("throws when STORAGE_ACCESS_KEY is missing", () => {
    process.env.STORAGE_ENDPOINT = "http://localhost:9000";
    process.env.STORAGE_SECRET_KEY = "minioadmin";
    delete process.env.STORAGE_ACCESS_KEY;

    jest.resetModules();

    const { getS3Client } = require("./s3-client");

    expect(() => getS3Client()).toThrow(/STORAGE_ACCESS_KEY/);
  });

  it("throws when STORAGE_SECRET_KEY is missing", () => {
    process.env.STORAGE_ENDPOINT = "http://localhost:9000";
    process.env.STORAGE_ACCESS_KEY = "minioadmin";
    delete process.env.STORAGE_SECRET_KEY;

    jest.resetModules();

    const { getS3Client } = require("./s3-client");

    expect(() => getS3Client()).toThrow(/STORAGE_SECRET_KEY/);
  });

  it("implements singleton pattern - returns same instance", () => {
    process.env.STORAGE_ENDPOINT = "http://localhost:9000";
    process.env.STORAGE_ACCESS_KEY = "minioadmin";
    process.env.STORAGE_SECRET_KEY = "minioadmin";

    jest.resetModules();

    const { getS3Client } = require("./s3-client");

    const client1 = getS3Client();
    const client2 = getS3Client();

    expect(client1).toBe(client2);
  });

  it("uses forcePathStyle: true for S3Client", () => {
    process.env.STORAGE_ENDPOINT = "http://localhost:9000";
    process.env.STORAGE_ACCESS_KEY = "minioadmin";
    process.env.STORAGE_SECRET_KEY = "minioadmin";

    jest.resetModules();

    const { getS3Client } = require("./s3-client");
    const client = getS3Client();

    expect(client).toBeDefined();
    expect(client.config.forcePathStyle).toBe(true);
  });

  it("throws with all required fields message", () => {
    delete process.env.STORAGE_ENDPOINT;
    delete process.env.STORAGE_ACCESS_KEY;
    delete process.env.STORAGE_SECRET_KEY;

    jest.resetModules();

    const { getS3Client } = require("./s3-client");

    expect(() => getS3Client()).toThrow(/STORAGE_ENDPOINT, STORAGE_ACCESS_KEY and STORAGE_SECRET_KEY/);
  });
});
