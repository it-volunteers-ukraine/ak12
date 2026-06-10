import { updateMobilizationMultiLangAction } from "./mobilizationActions";

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

describe("updateMobilizationMultiLangAction", () => {
  const basePayload = {
    en: {
      baseSection: {
        sectionTitle: "EN title",
        sectionSubtitle: "EN subtitle",
        menuButton: "EN menu",
        buttonJoinUs: "EN join",
        message: "EN msg",
      },
      cards: [
        {
          title: "t",
          subtitle: "s",
          primaryDescription: "p",
        },
      ],
      primaryDescription: "primary",
      accentedDescription: "accented",
      secondaryDescription: "secondary",
    },
    uk: {
      baseSection: {
        sectionTitle: "UK title",
        sectionSubtitle: "UK subtitle",
        menuButton: "UK menu",
        buttonJoinUs: "UK join",
        message: "UK msg",
      },
      cards: [
        {
          title: "t",
          subtitle: "s",
          primaryDescription: "p",
        },
      ],
      primaryDescription: "primary",
      accentedDescription: "accented",
      secondaryDescription: "secondary",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully save both locales", async () => {
    (saveContentAction as jest.Mock).mockResolvedValue({ success: true });

    const result = await updateMobilizationMultiLangAction(basePayload);

    expect(saveContentAction).toHaveBeenCalledTimes(2);

    expect(saveContentAction).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en",
        sectionKey: SECTION_KEYS.MOBILIZATION,
      }),
    );

    expect(saveContentAction).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "uk",
        sectionKey: SECTION_KEYS.MOBILIZATION,
      }),
    );

    expect(result).toEqual({ success: true });
  });

  it("should return first error when one locale fails", async () => {
    (saveContentAction as jest.Mock)
      .mockResolvedValueOnce({ success: false, error: "UK error" })
      .mockResolvedValueOnce({ success: true });

    const result = await updateMobilizationMultiLangAction(basePayload);

    expect(result).toEqual({
      success: false,
      error: "UK error",
    });

    expect(logger.warn).toHaveBeenCalled();
  });

  it("should handle fatal error (exception)", async () => {
    (saveContentAction as jest.Mock).mockRejectedValue(new Error("DB crash"));

    const result = await updateMobilizationMultiLangAction(basePayload);

    expect(logger.error).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: "Internal Server Error",
    });
  });
});
