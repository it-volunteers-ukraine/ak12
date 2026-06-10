import { updateHeroMultiLangAction } from "./heroActions";

import { saveContentAction } from "../content";
import { logger } from "@/lib/logger";
import { SECTION_KEYS } from "@/constants";

jest.mock("../content", () => ({
  saveContentAction: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe("updateHeroMultiLangAction", () => {
  const mockHero = () => ({
    title: "title",
    subtitle: "subtitle",
    buttonTitle: "button",
    features: [
      {
        type: "hiringChance" as const,
        label: "Hiring chance",
        value: "100%",
      },
      {
        type: "majors" as const,
        label: "Majors",
        value: "30+",
      },
      {
        type: "support" as const,
        label: "Support",
        value: "24/7",
      },
    ],
    backgroundImage: {
      publicId: "id",
      secureUrl: "url",
    },
  });

  const values = {
    en: mockHero(),
    uk: mockHero(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully update hero for all locales", async () => {
    (saveContentAction as jest.Mock).mockResolvedValue({ success: true });

    const result = await updateHeroMultiLangAction(values);

    expect(saveContentAction).toHaveBeenCalledTimes(2);

    expect(saveContentAction).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en",
        sectionKey: SECTION_KEYS.HERO,
      }),
    );

    expect(saveContentAction).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "uk",
        sectionKey: SECTION_KEYS.HERO,
      }),
    );

    expect(result).toEqual({ success: true });
  });

  it("should return first error when one locale fails", async () => {
    (saveContentAction as jest.Mock)
      .mockResolvedValueOnce({ success: false, error: "EN error" })
      .mockResolvedValueOnce({ success: true });

    const result = await updateHeroMultiLangAction(values);

    expect(logger.warn).toHaveBeenCalled();

    expect(result).toEqual({
      success: false,
      error: "EN error",
    });
  });

  it("should handle fatal error", async () => {
    (saveContentAction as jest.Mock).mockRejectedValue(new Error("DB crash"));

    const result = await updateHeroMultiLangAction(values);

    expect(logger.error).toHaveBeenCalled();

    expect(result).toEqual({
      success: false,
      error: "Internal Server Error",
    });
  });
});
