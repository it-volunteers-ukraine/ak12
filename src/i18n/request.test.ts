import config from "./request";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("next-intl/server", () => ({
  getRequestConfig: (fn: any) => fn,
}));

describe("request config", () => {
  it("returns en config", async () => {
    const result = await config({
      requestLocale: Promise.resolve("en"),
    });

    expect(result.locale).toBe("en");
    expect(result.messages).toBeDefined();
  });

  it("returns uk config", async () => {
    const result = await config({
      requestLocale: Promise.resolve("uk"),
    });

    expect(result.locale).toBe("uk");
    expect(result.messages).toBeDefined();
  });

  it("falls back to uk for unsupported locale", async () => {
    const result = await config({
      requestLocale: Promise.resolve("fr"),
    });

    expect(result.locale).toBe("uk");
    expect(result.messages).toBeDefined();
  });

  it("falls back to uk when locale is undefined", async () => {
    const result = await config({
      requestLocale: Promise.resolve(undefined),
    });

    expect(result.locale).toBe("uk");
    expect(result.messages).toBeDefined();
  });

  it("falls back to uk when locale is null", async () => {
    const result = await config({
      requestLocale: Promise.resolve(null as any),
    });

    expect(result.locale).toBe("uk");
    expect(result.messages).toBeDefined();
  });
});
