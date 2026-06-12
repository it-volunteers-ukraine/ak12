import { updateTransferMultiLangAction } from "./transfer";

import { saveContentAction } from "../content/content";
import { logger } from "@/lib/logger";
import { SECTION_KEYS } from "@/constants";

jest.mock("../content/content", () => ({
  saveContentAction: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe("updateTransferMultiLangAction", () => {
  const values = {
    uk: {
      title: "UA title",
    },
    en: {
      title: "EN title",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns success when all locales are saved", async () => {
    (saveContentAction as jest.Mock).mockResolvedValue({ success: true });

    await expect(updateTransferMultiLangAction(values as never)).resolves.toEqual({
      success: true,
    });

    expect(saveContentAction).toHaveBeenCalledTimes(2);

    expect(saveContentAction).toHaveBeenNthCalledWith(1, {
      rawContent: values.uk,
      locale: "uk",
      sectionKey: SECTION_KEYS.TRANSFER,
    });

    expect(saveContentAction).toHaveBeenNthCalledWith(2, {
      rawContent: values.en,
      locale: "en",
      sectionKey: SECTION_KEYS.TRANSFER,
    });

    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("returns first failed result when one locale fails", async () => {
    const failure = {
      success: false,
      error: "Validation failed",
    };

    (saveContentAction as jest.Mock).mockResolvedValueOnce({ success: true }).mockResolvedValueOnce(failure);

    await expect(updateTransferMultiLangAction(values as never)).resolves.toEqual(failure);

    expect(logger.warn).toHaveBeenCalledWith({ firstError: failure }, "Multi-lang partial failure");
  });

  it("handles exception and returns internal server error", async () => {
    const error = new Error("Unexpected");

    (saveContentAction as jest.Mock).mockRejectedValue(error);

    await expect(updateTransferMultiLangAction(values as never)).resolves.toEqual({
      success: false,
      error: "Internal Server Error",
    });

    expect(logger.error).toHaveBeenCalledWith(
      {
        error,
        section: SECTION_KEYS.TRANSFER,
      },
      "Multi-lang update fatal error",
    );
  });
});
