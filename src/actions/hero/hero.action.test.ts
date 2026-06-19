import { SECTION_KEYS } from "@/constants";
import { logger } from "@/lib/logger";
import { updateHeroMultiLangAction } from "@/actions/hero/hero.action";
import { saveContentAction } from "@/actions/content/content.action";

jest.mock("@/actions/content/content.action", () => ({
  saveContentAction: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const mockHero = {
  title: "Здобувай Перемагай",
  subtitle: "Твій розвиток — наша спільна сила. Один корпус — одна мета. Не зволікай — обирай",
  buttonTitle: "Дивитись вакансії",
  features: [
    {
      type: "hiringChance" as const,
      label: "Гарантія посади",
      value: "100%",
    },
    {
      type: "majors" as const,
      label: "спеціальностей",
      value: "30+",
    },
    {
      type: "support" as const,
      label: "Підтримка",
      value: "24/7",
    },
  ],
  backgroundImage: {
    publicId: "ak12/hero-background",
    secureUrl: "https://res.cloudinary.com/korneiko/image/upload/v1777475167/ak12/hero-background.png",
  },
};

const values = {
  en: mockHero,
  uk: mockHero,
};

describe("updateHeroMultiLangAction", () => {
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
