import { getDynamicSidebarMenu } from "@/lib/admin/sidebar-menu";
import { contentService } from "@/lib/content/content.service";

jest.mock("@/lib/content/content.service", () => ({
  contentService: {
    getBatchWithLatestTimestamps: jest.fn(),
  },
}));

jest.mock("@/lib/admin", () => ({
  ADMIN_SCHEMAS: {
    about: true,
    contacts: true,
  },
}));

jest.mock("@/components/admin/header-menu/mok", () => ({
  sidebarToSubmenuMap: {
    main: [
      { id: "about", title: "About" },
      { id: "contacts", title: "Contacts" },
      { id: "unknown", title: "Unknown" },
    ],
    empty: [],
  },
}));

const mockedContent = contentService as jest.Mocked<typeof contentService>;

describe("getDynamicSidebarMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns menu items with timestamps from service", async () => {
    mockedContent.getBatchWithLatestTimestamps.mockResolvedValue({
      about: "2025-01-01T00:00:00.000Z",
      contacts: "2025-01-02T00:00:00.000Z",
    });

    const result = await getDynamicSidebarMenu("uk", "main");

    expect(result).toEqual([
      {
        id: "about",
        title: "About",
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: "contacts",
        title: "Contacts",
        updatedAt: "2025-01-02T00:00:00.000Z",
      },
      {
        id: "unknown",
        title: "Unknown",
        updatedAt: undefined,
      },
    ]);

    expect(mockedContent.getBatchWithLatestTimestamps).toHaveBeenCalledWith({
      locale: "uk",
      sections: ["about", "contacts"],
    });
  });

  it("returns undefined updatedAt when timestamps missing", async () => {
    mockedContent.getBatchWithLatestTimestamps.mockResolvedValue({});

    const result = await getDynamicSidebarMenu("uk", "main");

    expect(result.every((i) => i.updatedAt === undefined)).toBe(true);
  });

  it("handles unknown sidebar key (empty menu)", async () => {
    mockedContent.getBatchWithLatestTimestamps.mockResolvedValue({});

    const result = await getDynamicSidebarMenu("uk", "non-existing");

    expect(result).toEqual([]);
  });

  it("filters out invalid schema keys", async () => {
    // override ADMIN_SCHEMAS locally for this test case
    jest.resetModules();

    jest.doMock("@/lib/admin", () => ({
      ADMIN_SCHEMAS: {
        about: true,
        // contacts removed => should be filtered out
      },
    }));

    jest.doMock("@/components/admin/header-menu/mok", () => ({
      sidebarToSubmenuMap: {
        main: [
          { id: "about", title: "About" },
          { id: "contacts", title: "Contacts" },
        ],
      },
    }));

    const { getDynamicSidebarMenu: dynamic } = require("./sidebar-menu");

    const { contentService } = require("@/lib/content/content.service");

    contentService.getBatchWithLatestTimestamps.mockResolvedValue({
      about: "2025-01-01T00:00:00.000Z",
    });

    const result = await dynamic("uk", "main");

    expect(result).toEqual([
      {
        id: "about",
        title: "About",
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: "contacts",
        title: "Contacts",
        updatedAt: undefined,
      },
    ]);
  });
});
