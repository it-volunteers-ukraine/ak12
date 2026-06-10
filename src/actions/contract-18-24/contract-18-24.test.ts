import { updateContract1824MultiLangAction } from "./contract-18-24";
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

describe("updateContract1824MultiLangAction", () => {
  const mockContract = () => ({
    baseSection: {
      sectionTitle: "title",
      sectionSubtitle: "subtitle",
      menuButton: "menu",
      buttonJoinUs: "join",
      message: "msg",
    },
    title: "title",
    subtitle: "subtitle",
    content: [
      {
        title: "content title",
        subtitle: "content subtitle",
      },
    ],
    contact: {
      startText: "start",
      number: "+380000000000",
      endText: "end",
    },
    imgContent: {
      title: "img title",
      subtitle: "img subtitle",
      backgroundImage: {
        publicId: "public-id",
        secureUrl: "https://example.com/image.jpg",
      },
    },
  });

  const values = {
    en: mockContract(),
    uk: mockContract(),
  };

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
