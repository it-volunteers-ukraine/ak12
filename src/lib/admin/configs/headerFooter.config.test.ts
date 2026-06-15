import { headerFooterFormBuilderConfig } from "./headerFooter.config";

type MockLink = {
  label: string;
};

type MockData = {
  uk: {
    header: {
      logoText: string;
      subLogoText: string;
      links: MockLink[];
      button: {
        href: string;
        text: string;
      };
      logoImg: null;
    };
    footer: {
      title: string;
      description: string;
      copyright: string;
      copyrightOwner: string;
    };
  };
  en: {
    header: {
      logoText: string;
      subLogoText: string;
      links: MockLink[];
      button: {
        href: string;
        text: string;
      };
      logoImg: null;
    };
    footer: {
      title: string;
      description: string;
      copyright: string;
      copyrightOwner: string;
    };
  };
};

const createLinks = (count: number, suffix = ""): MockLink[] =>
  Array.from({ length: count }).map((_, i) => ({
    label: `Link ${i + 1}${suffix}`,
  }));

const createMockData = (linksCount = 3): MockData => ({
  uk: {
    header: {
      logoText: "Logo",
      subLogoText: "SubLogo",
      links: createLinks(linksCount),
      button: {
        href: "/",
        text: "Button",
      },
      logoImg: null,
    },
    footer: {
      title: "Footer title",
      description: "Footer description",
      copyright: "© 2026",
      copyrightOwner: "Unit",
    },
  },

  en: {
    header: {
      logoText: "Logo EN",
      subLogoText: "SubLogo EN",
      links: createLinks(linksCount, " EN"),
      button: {
        href: "/",
        text: "Button EN",
      },
      logoImg: null,
    },
    footer: {
      title: "Footer title EN",
      description: "Footer description EN",
      copyright: "© 2026",
      copyrightOwner: "Unit EN",
    },
  },
});

const getConfig = () => (data: MockData) => headerFooterFormBuilderConfig(data);

const getMenuSection = (config: ReturnType<ReturnType<typeof getConfig>>) =>
  config.sections.find((s) => s.id === "header-menu");

describe("headerFooterFormBuilderConfig", () => {
  const mockData = createMockData(3);
  const buildConfig = getConfig();

  it("should generate base config", () => {
    const config = buildConfig(mockData);

    expect(config.id).toBe("header");

    expect(config.options).toMatchObject({
      hasImage: true,
      submitText: "Зберегти зміни",
      resetText: "Скасувати правки",
    });
  });

  it("should contain section groups", () => {
    const config = buildConfig(mockData);

    expect(config.sectionGroups).toMatchObject({
      header: {
        className: "flex flex-col gap-8",
        title: "Шапка сайту",
      },
      footer: {
        className: "flex flex-col",
        title: "Підвал сайту",
      },
    });
  });

  it("should include header sections", () => {
    const config = buildConfig(mockData);

    const sectionIds = config.sections.map((s) => s.id);

    expect(sectionIds).toEqual(expect.arrayContaining(["text-content", "header-button", "header-menu"]));
  });

  it("should generate menu fields dynamically from links", () => {
    const config = buildConfig(mockData);
    const menuSection = getMenuSection(config);

    expect(menuSection).toBeDefined();

    expect(menuSection?.fields.length).toBe(mockData.uk.header.links.length);

    menuSection?.fields.forEach((field, index) => {
      expect(field.name).toBe(`header.links[${index}].label`);
      expect(field.type).toBe("text");
      expect(field.required).toBe(true);

      // intentionally not defined
      expect(field.label).toBeUndefined();
    });
  });

  it("should include footer section", () => {
    const config = buildConfig(mockData);

    const footer = config.sections.find((s) => s.id === "footer-text");

    expect(footer).toBeDefined();
    expect(footer?.group).toBe("footer");

    const requiredFields = footer?.fields.filter((f) => f.required);

    expect(requiredFields?.length).toBe(4);
  });

  it("should ensure all sections have valid structure", () => {
    const config = buildConfig(mockData);

    config.sections.forEach((section) => {
      expect(section.id).toBeTruthy();
      expect(Array.isArray(section.fields)).toBe(true);

      section.fields.forEach((field) => {
        expect(field.name).toBeTruthy();
        expect(field.type).toBeTruthy();

        if (field.label) {
          expect(field.label.uk).toBeTruthy();
          expect(field.label.en).toBeTruthy();
        }
      });
    });
  });
});
