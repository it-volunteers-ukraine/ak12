const mockGetSupabaseClient = jest.fn(() => ({ __client: "supabase" }));

jest.mock("./supabase.client", () => ({
  getSupabaseClient: () => mockGetSupabaseClient(),
}));

jest.mock("./postgres.client", () => ({
  postgresClient: { __client: "postgres" },
}));

describe("getDbClient", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    process.env = {
      ...originalEnv,
    };

    delete process.env.DB_CLIENT;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should return the Postgres client in production without constructing Supabase", () => {
    process.env = {
      ...process.env,
      NODE_ENV: "production",
    };

    const { getDbClient } = require("./index");
    const client = getDbClient();

    expect(client).toEqual({ __client: "postgres" });
    expect(mockGetSupabaseClient).not.toHaveBeenCalled();
  });

  it("should return the Supabase client outside of production", () => {
    process.env = {
      ...process.env,
      NODE_ENV: "development",
    };

    delete process.env.DB_CLIENT;

    const { getDbClient } = require("./index");
    const client = getDbClient();

    expect(client).toEqual({ __client: "supabase" });
    expect(mockGetSupabaseClient).toHaveBeenCalledTimes(1);
  });

  it("should honor DB_CLIENT=postgres even when NODE_ENV is development", () => {
    process.env = {
      ...process.env,
      NODE_ENV: "development",
      DB_CLIENT: "postgres",
    };

    const { getDbClient } = require("./index");
    const client = getDbClient();

    expect(client).toEqual({ __client: "postgres" });
    expect(mockGetSupabaseClient).not.toHaveBeenCalled();
  });

  it("should honor DB_CLIENT=supabase even when NODE_ENV is production", () => {
    process.env = {
      ...process.env,
      NODE_ENV: "production",
      DB_CLIENT: "supabase",
    };

    const { getDbClient } = require("./index");
    const client = getDbClient();

    expect(client).toEqual({ __client: "supabase" });
    expect(mockGetSupabaseClient).toHaveBeenCalledTimes(1);
  });

  it("should memoize the selected client", () => {
    process.env = {
      ...process.env,
      NODE_ENV: "development",
    };

    delete process.env.DB_CLIENT;

    const { getDbClient } = require("./index");
    const first = getDbClient();
    const second = getDbClient();

    expect(first).toBe(second);
    expect(mockGetSupabaseClient).toHaveBeenCalledTimes(1);
  });
});
