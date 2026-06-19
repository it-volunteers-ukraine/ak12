import { SECTION_KEYS } from "@/constants";
import { logger } from "@/lib/logger";
import { updateContract1824MultiLangAction } from "@/actions/contract-18-24/contract-18-24.action";
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

const mockContract = {
  baseSection: {
    sectionTitle: "Контракт для молодих",
    sectionSubtitle: "Тобі 18-24? Спробуй себе, отримай досвід і повертайся до цивільного життя або залишайся з нами",
    menuButton: "Контракт 18-24",
    buttonJoinUs: "Подати заявку",
    message: 'Ця форма відправлена з блоку "Контракт 18-24"',
  },
  title: "Що ти отримуєш",
  subtitle: "Забезпечення, технології та можливість самостійно обрати свій шлях у 18–24 роки",
  content: [
    {
      title: "Контракт однорічний або дворічний",
      subtitle: "Чітка дата демобілізації",
    },
    {
      title: "Якісне навчання та підготовку",
      subtitle: "Можливість навчання за кордоном",
    },
  ],
  contact: {
    startText: "Телефонуй",
    number: "0505050550",
    endText: "або заповнюй анкету",
  },
  imgContent: {
    title: "Про піхоту дбають. Якщо щось потрібно, пишеш старшині. Він усе збере.",
    subtitle: "72 ОМБр ім. Чорних Запорожців",
    backgroundImage: {
      publicId: "ak12/contract-18-24-background",
      secureUrl: "https://res.cloudinary.com/korneiko/image/upload/v1779788292/ak12/contract-18-24-background.jpg",
    },
  },
};

const values = {
  en: mockContract,
  uk: mockContract,
};

describe("updateContract1824MultiLangAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully save contract-18-24 for all locales", async () => {
    (saveContentAction as jest.Mock).mockResolvedValue({ success: true });

    const result = await updateContract1824MultiLangAction(values);

    expect(saveContentAction).toHaveBeenCalledTimes(2);

    expect(saveContentAction).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en",
        sectionKey: SECTION_KEYS.CONTRACT_18_24,
      }),
    );

    expect(saveContentAction).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "uk",
        sectionKey: SECTION_KEYS.CONTRACT_18_24,
      }),
    );

    expect(result).toEqual({ success: true });
  });

  it("should return first error when one locale fails", async () => {
    (saveContentAction as jest.Mock)
      .mockResolvedValueOnce({ success: false, error: "EN error" })
      .mockResolvedValueOnce({ success: true });

    const result = await updateContract1824MultiLangAction(values);

    expect(logger.warn).toHaveBeenCalled();

    expect(result).toEqual({
      success: false,
      error: "EN error",
    });
  });

  it("should handle fatal error (exception)", async () => {
    (saveContentAction as jest.Mock).mockRejectedValue(new Error("DB crash"));

    const result = await updateContract1824MultiLangAction(values);

    expect(logger.error).toHaveBeenCalled();

    expect(result).toEqual({
      success: false,
      error: "Internal Server Error",
    });
  });
});
