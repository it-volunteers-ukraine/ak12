/**
 * @jest-environment node
 */
import z from "zod";
import { SECTION_KEYS } from "@/constants";
import { contentService } from "@/lib/content/content.service";
import { supabaseServer } from "@/lib/supabase-server/supabase-server";
import { languageService } from "@/lib/language/language.service";

jest.mock("@/lib/logger/logger", () => ({
  logger: { error: jest.fn(), info: jest.fn() },
}));

jest.mock("@/lib/supabase-server/supabase-server", () => ({
  supabaseServer: { from: jest.fn() },
}));

jest.mock("@/lib/language/language.service", () => ({
  languageService: { ensure: jest.fn() },
}));

const mockedSupabase = jest.mocked(supabaseServer);
const mockedEnsure = jest.mocked(languageService.ensure);

const testSchema = z.object({
  title: z.string(),
  count: z.number(),
});

beforeEach(() => {
  jest.clearAllMocks();
  mockedEnsure.mockResolvedValue({ id: "lang-uk" } as any);
});

const mockFindContent = (response: { data: any; error: any }) => {
  const maybeSingle = jest.fn().mockResolvedValue(response);
  const limit = jest.fn(() => ({ maybeSingle }));
  const order = jest.fn(() => ({ limit }));
  const eqLanguage = jest.fn(() => ({ order }));
  const eqActive = jest.fn(() => ({ eq: eqLanguage }));
  const eqSection = jest.fn(() => ({ eq: eqActive }));
  const select = jest.fn(() => ({ eq: eqSection }));

  mockedSupabase.from.mockReturnValueOnce({ select } as any);

  return { maybeSingle, select };
};

describe("contentService.get", () => {
  it("returns parsed content", async () => {
    mockFindContent({
      data: { id: "1", content: { title: "A", count: 1 } },
      error: null,
    });

    const result = await contentService.get({
      locale: "uk",
      schema: testSchema,
      section: SECTION_KEYS.ABOUT,
    });

    expect(result).toEqual({ title: "A", count: 1 });
  });

  it("returns null on invalid schema", async () => {
    mockFindContent({
      data: { id: "1", content: { title: 123, count: "bad" } },
      error: null,
    });

    const result = await contentService.get({
      locale: "uk",
      schema: testSchema,
      section: SECTION_KEYS.ABOUT,
    });

    expect(result).toBeNull();
  });

  it("returns null when no record", async () => {
    mockFindContent({ data: null, error: null });

    const result = await contentService.get({
      locale: "uk",
      schema: testSchema,
      section: SECTION_KEYS.ABOUT,
    });

    expect(result).toBeNull();
  });
});

describe("contentService.save", () => {
  it("handles update path", async () => {
    mockFindContent({
      data: { id: "1", content: { title: "old", count: 1 } },
      error: null,
    });

    const eq = jest.fn().mockResolvedValue({ error: null });
    const update = jest.fn(() => ({ eq }));

    mockedSupabase.from.mockReturnValueOnce({ update } as any);

    const result = await contentService.save({
      locale: "uk",
      schema: testSchema,
      sectionKey: SECTION_KEYS.ABOUT,
      rawContent: { title: "new", count: 2 },
    });

    expect(result.success).toBe(true);
    expect(update).toHaveBeenCalled();
  });

  it("handles insert path", async () => {
    mockFindContent({ data: null, error: null });

    const insert = jest.fn().mockResolvedValue({ error: null });

    mockedSupabase.from.mockReturnValueOnce({ insert } as any);

    const result = await contentService.save({
      locale: "uk",
      schema: testSchema,
      sectionKey: SECTION_KEYS.ABOUT,
      rawContent: { title: "x", count: 1 },
    });

    expect(result.success).toBe(true);
    expect(insert).toHaveBeenCalled();
  });

  it("returns failure for invalid schema", async () => {
    const result = await contentService.save({
      locale: "uk",
      schema: testSchema,
      sectionKey: SECTION_KEYS.ABOUT,
      rawContent: { title: 1, count: "no" },
    });

    expect(result.success).toBe(false);
    expect(mockedSupabase.from).not.toHaveBeenCalled();
  });

  it("handles thrown error in update", async () => {
    mockFindContent({
      data: { id: "1", content: { title: "old", count: 1 } },
      error: null,
    });

    const eq = jest.fn().mockResolvedValue({ error: { message: "fail" } });
    const update = jest.fn(() => ({ eq }));

    mockedSupabase.from.mockReturnValueOnce({ update } as any);

    const result = await contentService.save({
      locale: "uk",
      schema: testSchema,
      sectionKey: SECTION_KEYS.ABOUT,
      rawContent: { title: "new", count: 2 },
    });

    expect(result.success).toBe(false);
  });

  it("handles thrown error in insert", async () => {
    mockFindContent({ data: null, error: null });

    const insert = jest.fn().mockResolvedValue({ error: { message: "fail" } });

    mockedSupabase.from.mockReturnValueOnce({ insert } as any);

    const result = await contentService.save({
      locale: "uk",
      schema: testSchema,
      sectionKey: SECTION_KEYS.ABOUT,
      rawContent: { title: "new", count: 2 },
    });

    expect(result.success).toBe(false);
  });

  it("handles outer catch block", async () => {
    mockedSupabase.from.mockImplementation(() => {
      throw new Error("boom");
    });

    const result = await contentService.save({
      locale: "uk",
      schema: testSchema,
      sectionKey: SECTION_KEYS.ABOUT,
      rawContent: { title: "x", count: 1 },
    });

    expect(result.success).toBe(false);
  });
});

describe("timestamp logic coverage", () => {
  it("normalizes Date object", async () => {
    const mockDate = new Date("2024-01-01T00:00:00Z");

    mockedSupabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            eq: () => ({
              order: () => ({
                limit: () => ({
                  maybeSingle: async () => ({
                    data: { updated_at: mockDate },
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    } as any);

    const res = await contentService.getUpdatedAt({
      locale: "uk",
      section: SECTION_KEYS.ABOUT,
    });

    expect(res).toContain("2024");
  });

  it("returns null for invalid date", async () => {
    mockedSupabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            eq: () => ({
              order: () => ({
                limit: () => ({
                  maybeSingle: async () => ({
                    data: { updated_at: "bad-date" },
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    } as any);

    const res = await contentService.getUpdatedAt({
      locale: "uk",
      section: SECTION_KEYS.ABOUT,
    });

    expect(res).toBeNull();
  });

  it("covers batch timestamps + duplicate keys + invalid values", async () => {
    mockedSupabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            in: () => ({
              order: () => ({
                then: async (cb: any) =>
                  cb({
                    data: [
                      {
                        section_key: "a",
                        updated_at: "2024-01-01 10:00:00",
                      },
                      {
                        section_key: "a",
                        updated_at: "2024-01-02 10:00:00",
                      },
                      {
                        section_key: "b",
                        updated_at: "bad-date",
                      },
                    ],
                    error: null,
                  }),
              }),
            }),
          }),
        }),
      }),
    } as any);

    const res = await contentService.getBatchWithLatestTimestamps({
      locale: "uk",
      sections: [SECTION_KEYS.ABOUT],
    });

    expect(res).toHaveProperty("a");
    expect(res.b).toBeUndefined();
  });

  it("handles batch error path", async () => {
    mockedSupabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            in: () => ({
              order: () => ({
                then: async (cb: any) => cb({ data: null, error: new Error("fail") }),
              }),
            }),
          }),
        }),
      }),
    } as any);

    const res = await contentService.getBatchWithLatestTimestamps({
      locale: "uk",
      sections: ["x" as any],
    });

    expect(res).toEqual({});
  });
});
