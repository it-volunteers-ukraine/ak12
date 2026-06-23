import { getLanguageMap } from "@/utils/vacancies/get-language-map";
import { supabaseServer } from "@/lib/supabase-server/supabase-server";
import { logger } from "@/lib/logger/logger";

jest.mock("@/lib/logger/logger", () => ({
  logger: { error: jest.fn() },
}));

jest.mock("@/lib/supabase-server/supabase-server", () => ({
  supabaseServer: {
    from: jest.fn(),
  },
}));

const stubLanguageTable = (data: Array<{ id: string; code: string }>) => {
  (supabaseServer.from as jest.Mock).mockReturnValue({
    select: jest.fn().mockResolvedValue({ data, error: null }),
  });
};

describe("getLanguageMap", () => {
  it("should return a code→id record for the language table", async () => {
    stubLanguageTable([
      { id: "lang-uk-id", code: "uk" },
      { id: "lang-en-id", code: "en" },
    ]);

    await expect(getLanguageMap()).resolves.toEqual({
      uk: "lang-uk-id",
      en: "lang-en-id",
    });

    expect(supabaseServer.from).toHaveBeenCalledWith("language");
  });

  it("should return an empty record when the language table is empty", async () => {
    stubLanguageTable([]);

    await expect(getLanguageMap()).resolves.toEqual({});

    expect(supabaseServer.from).toHaveBeenCalledWith("language");
  });

  it("should log and throw when supabase returns an error", async () => {
    const error = {
      message: "Database failure",
    };

    (supabaseServer.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: null,
        error,
      }),
    });

    await expect(getLanguageMap()).rejects.toThrow(error.message);

    expect(logger.error).toHaveBeenCalledWith({ error }, "Failed to get languages");
  });
});
