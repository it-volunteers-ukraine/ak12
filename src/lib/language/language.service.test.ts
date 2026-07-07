import { Locale } from "@/types";
import { languageService } from "@/lib/language/language.service";
import { supabaseServer } from "@/lib/supabase-server/supabase-server";
import { logger } from "@/lib/logger/logger";

jest.mock("@/lib/supabase-server/supabase-server", () => ({
  supabaseServer: {
    from: jest.fn(),
  },
}));

jest.mock("@/lib/logger/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const mockedSupabase = jest.mocked(supabaseServer);
const mockedLogger = jest.mocked(logger);

describe("languageService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return existing language when found", async () => {
    const select = jest.fn().mockResolvedValue({
      data: { id: "lang-1" },
      error: null,
    });

    mockedSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle: select,
        }),
      }),
    } as never);

    const result = await languageService.ensure("uk" as Locale);

    expect(result).toEqual({ id: "lang-1" });
  });

  it("should throw error when select fails", async () => {
    const select = jest.fn().mockResolvedValue({
      data: null,
      error: { message: "select error" },
    });

    mockedSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle: select,
        }),
      }),
    } as never);

    await expect(languageService.ensure("uk" as Locale)).rejects.toThrow("Failed to read language uk");

    expect(mockedLogger.error).toHaveBeenCalled();
  });

  it("should create language when not exists", async () => {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: null,
      error: null,
    });

    const insert = jest.fn().mockReturnValue({
      select: () => ({
        single: jest.fn().mockResolvedValue({
          data: { id: "lang-new" },
          error: null,
        }),
      }),
    });

    mockedSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle,
        }),
      }),
      insert,
    } as never);

    const result = await languageService.ensure("uk" as Locale);

    expect(insert).toHaveBeenCalledWith({ code: "uk" });
    expect(result).toEqual({ id: "lang-new" });
  });

  it("should log info when language not found", async () => {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: null,
      error: null,
    });

    const insert = jest.fn().mockReturnValue({
      select: () => ({
        single: jest.fn().mockResolvedValue({
          data: { id: "lang-new" },
          error: null,
        }),
      }),
    });

    mockedSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle,
        }),
      }),
      insert,
    } as never);

    await languageService.ensure("uk" as Locale);

    expect(mockedLogger.info).toHaveBeenCalled();
  });

  it("should throw error when insert fails", async () => {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: null,
      error: null,
    });

    const insert = jest.fn().mockReturnValue({
      select: () => ({
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "insert error" },
        }),
      }),
    });

    mockedSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle,
        }),
      }),
      insert,
    } as never);

    await expect(languageService.ensure("uk" as Locale)).rejects.toThrow("Failed to create language uk");

    expect(mockedLogger.error).toHaveBeenCalled();
  });
});
