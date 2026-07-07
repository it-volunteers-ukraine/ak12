import config from "@/i18n/request";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("next-intl/server", () => ({
  getRequestConfig: (fn: any) => fn,
}));

describe("request config", () => {
  it.each([
    ["en", "en"],
    ["uk", "uk"],
    ["fr", "uk"],
    [undefined, "uk"],
    [null, "uk"],
  ])("returns %s locale as %s", async (requestLocale, expectedLocale) => {
    const result = await config({
      requestLocale: Promise.resolve(requestLocale as any),
    });

    expect(result.locale).toBe(expectedLocale);
    expect(result.messages).toBeDefined();
  });
});
