const createNavigationMock = jest.fn(() => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("next-intl/navigation", () => ({
  createNavigation: createNavigationMock,
}));

describe("navigation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates navigation with correct config", () => {
    jest.isolateModules(() => {
      require("./navigation");
    });

    expect(createNavigationMock).toHaveBeenCalledTimes(1);
    expect(createNavigationMock).toHaveBeenCalledWith({
      locales: ["en", "uk"],
      defaultLocale: "uk",
    });
  });

  it("exports usePathname and useRouter", () => {
    let navigation: any;

    jest.isolateModules(() => {
      navigation = require("./navigation");
    });

    expect(navigation.usePathname).toBeDefined();
    expect(navigation.useRouter).toBeDefined();
  });
});
