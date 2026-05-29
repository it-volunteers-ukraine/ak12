/**
 * @jest-environment node
 */
import z from "zod";

import { contentService } from "./content.service";
import { supabaseServer } from "@/lib/supabase-server";
import { languageService } from "@/lib/language/language.service";
import { SECTION_KEYS } from "@/constants";

jest.mock("@/lib/logger", () => ({
  logger: { error: jest.fn(), info: jest.fn() },
}));

jest.mock("@/lib/supabase-server", () => ({
  supabaseServer: { from: jest.fn() },
}));

jest.mock("@/lib/language/language.service", () => ({
  languageService: { ensure: jest.fn() },
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}));

const mockedSupabase = jest.mocked(supabaseServer);
const mockedEnsure = jest.mocked(languageService.ensure);

const testSchema = z.object({
  title: z.string(),
  count: z.number(),
});

beforeEach(() => {
  jest.clearAllMocks();
  mockedEnsure.mockResolvedValue({ id: "lang-uk" });
});

const mockFindContent = (response: { data: unknown; error: unknown }) => {
  const maybeSingle = jest.fn().mockResolvedValue(response);
  const limit = jest.fn(() => ({ maybeSingle }));
  const order = jest.fn(() => ({ limit }));
  const eqLanguage = jest.fn(() => ({ order }));
  const eqActive = jest.fn(() => ({ eq: eqLanguage }));
  const eqSection = jest.fn(() => ({ eq: eqActive }));
  const select = jest.fn(() => ({ eq: eqSection }));

  mockedSupabase.from.mockReturnValueOnce({ select } as never);

  return { select, eqSection, eqActive, eqLanguage, order, limit, maybeSingle };
};

describe("contentService.get", () => {
  it("should return parsed content for a valid record", async () => {
    mockFindContent({
      data: { id: "rec-1", content: { title: "Hello", count: 5 } },
      error: null,
    });

    const result = await contentService.get({
      locale: "uk",
      schema: testSchema,
      section: SECTION_KEYS.ABOUT,
    });

    expect(result).toEqual({ title: "Hello", count: 5 });
    expect(mockedEnsure).toHaveBeenCalledWith("uk");
  });

  it.each([
    {
      label: "no record exists",
      response: { data: null, error: null },
    },
    {
      label: "stored content fails schema validation",
      response: { data: { id: "rec-2", content: { title: 123, count: "oops" } }, error: null },
    },
    {
      label: "the supabase query errors",
      response: { data: null, error: { message: "boom" } },
    },
  ])("should return null when $label", async ({ response }) => {
    mockFindContent(response);

    const result = await contentService.get({
      locale: "uk",
      schema: testSchema,
      section: SECTION_KEYS.ABOUT,
    });

    expect(result).toBeNull();
  });
});

describe("contentService.save", () => {
  it("should update an existing record when one is found", async () => {
    mockFindContent({
      data: { id: "rec-1", content: { title: "old", count: 1 } },
      error: null,
    });

    const eqUpdate = jest.fn().mockResolvedValue({ error: null });
    const update = jest.fn(() => ({ eq: eqUpdate }));

    mockedSupabase.from.mockReturnValueOnce({ update } as never);

    const result = await contentService.save({
      locale: "uk",
      schema: testSchema,
      sectionKey: SECTION_KEYS.ABOUT,
      rawContent: { title: "new", count: 2 },
    });

    expect(result).toEqual({ success: true, data: { title: "new", count: 2 } });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        content: { title: "new", count: 2 },
        is_active: true,
        updated_at: expect.any(String),
      }),
    );
    expect(eqUpdate).toHaveBeenCalledWith("id", "rec-1");
  });

  it("should insert a new record when none is found", async () => {
    mockFindContent({ data: null, error: null });

    const insert = jest.fn().mockResolvedValue({ error: null });

    mockedSupabase.from.mockReturnValueOnce({ insert } as never);

    const result = await contentService.save({
      locale: "uk",
      schema: testSchema,
      sectionKey: SECTION_KEYS.ABOUT,
      rawContent: { title: "fresh", count: 7 },
    });

    expect(result).toEqual({ success: true, data: { title: "fresh", count: 7 } });
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        section_key: SECTION_KEYS.ABOUT,
        content: { title: "fresh", count: 7 },
        is_active: true,
        language_id: "lang-uk",
      }),
    );
  });

  it("should refuse to save invalid content", async () => {
    const result = await contentService.save({
      locale: "uk",
      schema: testSchema,
      sectionKey: SECTION_KEYS.ABOUT,
      rawContent: { title: 999, count: "no" },
    });

    expect(result).toEqual({ success: false, error: "Invalid form data" });
    expect(mockedSupabase.from).not.toHaveBeenCalled();
  });

  it("should return a failure result when the update query errors", async () => {
    mockFindContent({
      data: { id: "rec-1", content: { title: "old", count: 1 } },
      error: null,
    });

    const eqUpdate = jest.fn().mockResolvedValue({ error: { message: "db down" } });
    const update = jest.fn(() => ({ eq: eqUpdate }));

    mockedSupabase.from.mockReturnValueOnce({ update } as never);

    const result = await contentService.save({
      locale: "uk",
      schema: testSchema,
      sectionKey: SECTION_KEYS.ABOUT,
      rawContent: { title: "new", count: 2 },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain(SECTION_KEYS.ABOUT);
    }
  });
});
