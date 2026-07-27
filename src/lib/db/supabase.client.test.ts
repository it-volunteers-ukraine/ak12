const mockCreateClient = jest.fn().mockReturnValue({
  from: jest.fn(),
  rpc: jest.fn(),
});

jest.mock("@supabase/supabase-js", () => ({
  createClient: (...args: any[]) => mockCreateClient(...args),
}));

describe("supabaseClient initialization", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockCreateClient.mockClear();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should not construct the client (or throw) merely on import", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_SERVICE_KEY;

    expect(() => {
      require("./supabase.client");
    }).not.toThrow();
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it("should throw an error if NEXT_PUBLIC_SUPABASE_URL is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

    const { createSupabaseClient } = require("./supabase.client");

    expect(() => createSupabaseClient()).toThrow("NEXT_PUBLIC_SUPABASE_URL is not set");
  });

  it("should throw an error indicating both keys are missing when both service keys are missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_SERVICE_KEY;

    const { createSupabaseClient } = require("./supabase.client");

    expect(() => createSupabaseClient()).toThrow("Missing: SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SERVICE_KEY");
  });

  it("should initialize client successfully when URL and SUPABASE_SERVICE_ROLE_KEY are set", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
    delete process.env.SUPABASE_SERVICE_KEY;

    const { createSupabaseClient } = require("./supabase.client");
    const supabaseClient = createSupabaseClient();

    expect(supabaseClient).toBeDefined();
    expect(mockCreateClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "service-role-key",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  });

  it("should initialize client successfully when URL and SUPABASE_SERVICE_KEY are set", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.SUPABASE_SERVICE_KEY = "service-key";

    const { createSupabaseClient } = require("./supabase.client");
    const supabaseClient = createSupabaseClient();

    expect(supabaseClient).toBeDefined();
    expect(mockCreateClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "service-key",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  });

  it("should memoize the client across getSupabaseClient calls", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

    const { getSupabaseClient } = require("./supabase.client");
    const first = getSupabaseClient();
    const second = getSupabaseClient();

    expect(first).toBe(second);
    expect(mockCreateClient).toHaveBeenCalledTimes(1);
  });
});
