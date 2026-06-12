import { logger } from "@/lib/logger";
import { SECTION_KEYS } from "@/constants";
import { saveContentAction } from "../content/content";
import { updateAboutMultiLangAction } from "./about";

jest.mock("@/lib/logger", () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../content/content", () => ({
  saveContentAction: jest.fn(),
}));

describe("updateAboutMultiLangAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns success when all locales succeed", async () => {
    (saveContentAction as jest.Mock).mockResolvedValue({
      success: true,
    });

    const result = await updateAboutMultiLangAction({
      uk: { title: "UK" },
      en: { title: "EN" },
    } as any);

    expect(saveContentAction).toHaveBeenCalledTimes(2);

    expect(saveContentAction).toHaveBeenNthCalledWith(1, {
      locale: "uk",
      rawContent: { title: "UK" },
      sectionKey: SECTION_KEYS.ABOUT,
    });

    expect(saveContentAction).toHaveBeenNthCalledWith(2, {
      locale: "en",
      rawContent: { title: "EN" },
      sectionKey: SECTION_KEYS.ABOUT,
    });

    expect(result).toEqual({
      success: true,
    });
  });

  it("returns first error and logs warning when one locale fails", async () => {
    const errorResult = {
      success: false,
      error: "validation failed",
    };

    (saveContentAction as jest.Mock)
      .mockResolvedValueOnce({
        success: true,
      })
      .mockResolvedValueOnce(errorResult);

    const result = await updateAboutMultiLangAction({
      uk: {},
      en: {},
    } as any);

    expect(logger.warn).toHaveBeenCalledWith({ firstError: errorResult }, "Multi-lang partial failure");

    expect(result).toEqual(errorResult);
  });

  it("returns internal server error when saveContentAction rejects", async () => {
    (saveContentAction as jest.Mock).mockRejectedValue(new Error("boom"));

    const result = await updateAboutMultiLangAction({
      uk: {},
    } as any);

    expect(logger.error).toHaveBeenCalledWith(
      {
        error: expect.any(Error),
        section: SECTION_KEYS.ABOUT,
      },
      "Multi-lang update fatal error",
    );

    expect(result).toEqual({
      success: false,
      error: "Internal Server Error",
    });
  });
});
