import { getLanguageMap } from "./get-language-map";
import { supabaseServer } from "@/lib/supabase-server";

jest.mock("@/lib/logger", () => ({
  logger: { error: jest.fn() },
}));

jest.mock("@/lib/supabase-server", () => ({
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
  it.each([
    {
      label: "a populated language table",
      data: [
        { id: "lang-uk-id", code: "uk" },
        { id: "lang-en-id", code: "en" },
      ],
      expected: { uk: "lang-uk-id", en: "lang-en-id" },
    },
    {
      label: "an empty language table",
      data: [],
      expected: {},
    },
  ])("should map $label into a code→id record", async ({ data, expected }) => {
    stubLanguageTable(data);

    expect(await getLanguageMap()).toEqual(expected);
    expect(supabaseServer.from).toHaveBeenCalledWith("language");
  });
});
