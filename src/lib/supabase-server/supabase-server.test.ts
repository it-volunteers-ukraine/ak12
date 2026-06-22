const mockCreateClient = jest.fn().mockReturnValue({});

jest.mock("@supabase/supabase-js", () => ({
  createClient: (...args: any[]) => mockCreateClient(...args),
}));

describe("supabaseServer client initialization", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    mockCreateClient.mockClear();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should initialize supabase client successfully when all env variables are set", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-secret-key";

    const { supabaseServer } = require("./supabase-server");

    expect(mockCreateClient).toHaveBeenCalledWith("https://supabase.co", "service-role-secret-key", {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    expect(supabaseServer).toBeDefined();
  });

  it("should fallback to SUPABASE_SERVICE_KEY if ROLE_KEY is missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://supabase.co";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.SUPABASE_SERVICE_KEY = "service-backup-key";

    const { supabaseServer } = require("./supabase-server");

    expect(mockCreateClient).toHaveBeenCalledWith("https://supabase.co", "service-backup-key", expect.any(Object));
    expect(supabaseServer).toBeDefined();
  });

  it("should throw error when NEXT_PUBLIC_SUPABASE_URL is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.SUPABASE_SERVICE_ROLE_KEY = "secret";

    expect(() => {
      require("./supabase-server");
    }).toThrow("NEXT_PUBLIC_SUPABASE_URL is not set");
  });

  it("should throw error when both service keys are missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://supabase.co";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_SERVICE_KEY;

    expect(() => {
      require("./supabase-server");
    }).toThrow(
      "Neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_SERVICE_KEY is set (server-side admin access requires one of them). Missing: SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SERVICE_KEY",
    );
  });
});
