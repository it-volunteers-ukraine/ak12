import { revalidatePath } from "next/cache";
import { SECTION_KEYS } from "@/constants";
import { contentService } from "@/lib/content/content.service";
import { logger } from "@/lib/logger";
import { saveContentAction, updateContentMultiLang } from "@/actions/content/content.action";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/lib/content/content.service", () => ({
  contentService: {
    save: jest.fn(),
  },
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}));

const mockSave = contentService.save as jest.Mock;

describe("saveContentAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error when schema not found", async () => {
    const result = await saveContentAction({
      locale: "uk",
      rawContent: {},
      sectionKey: "unknown" as any,
    });

    expect(result).toEqual({
      success: false,
      error: "Schema for section unknown not found",
    });

    expect(mockSave).not.toHaveBeenCalled();
  });

  it("revalidates paths on success", async () => {
    mockSave.mockResolvedValue({
      success: true,
    });

    const result = await saveContentAction({
      locale: "uk",
      rawContent: {},
      sectionKey: SECTION_KEYS.HERO,
    });

    expect(result).toEqual({
      success: true,
    });

    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/admin");
  });

  it("does not revalidate on failure", async () => {
    mockSave.mockResolvedValue({
      success: false,
      error: "failed",
    });

    await saveContentAction({
      locale: "uk",
      rawContent: {},
      sectionKey: SECTION_KEYS.HERO,
    });

    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("updateContentMultiLang", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns success when all locales succeed", async () => {
    mockSave.mockResolvedValue({
      success: true,
    });

    const result = await updateContentMultiLang(
      SECTION_KEYS.HERO as any,
      {
        uk: {},
        en: {},
      } as any,
    );

    expect(result).toEqual({
      success: true,
    });

    expect(mockSave).toHaveBeenCalledTimes(2);
  });

  it("returns error when one locale fails", async () => {
    mockSave.mockResolvedValueOnce({ success: true }).mockResolvedValueOnce({ success: false });

    const result = await updateContentMultiLang(
      SECTION_KEYS.HERO as any,
      {
        uk: {},
        en: {},
      } as any,
    );

    expect(result).toEqual({
      success: false,
      error: "Помилка збереження. Дані для деяких мов могли не оновитися.",
    });

    expect(logger.error).toHaveBeenCalled();
  });

  it("returns error when one promise rejects", async () => {
    mockSave.mockResolvedValueOnce({ success: true }).mockRejectedValueOnce(new Error("boom"));

    const result = await updateContentMultiLang(
      SECTION_KEYS.HERO as any,
      {
        uk: {},
        en: {},
      } as any,
    );

    expect(result).toEqual({
      success: false,
      error: "Помилка збереження. Дані для деяких мов могли не оновитися.",
    });

    expect(logger.error).toHaveBeenCalled();
  });
});
