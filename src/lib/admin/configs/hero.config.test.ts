import { createHeroFormBuilderConfig } from "./hero.config";

type MockFeature = {
  type: "hiringChance" | "majors" | "support";
  label: string;
  value: string;
};

type MockHeroData = {
  uk: {
    title: string;
    subtitle: string;
    buttonTitle: string;
    features: MockFeature[];
  };
  en: {
    title: string;
    subtitle: string;
    buttonTitle: string;
    features: MockFeature[];
  };
};

const createMockHeroData = (features: MockFeature[] = []): MockHeroData => ({
  uk: {
    title: "Test title",
    subtitle: "Test subtitle",
    buttonTitle: "Test button",
    features,
  },
  en: {
    title: "Test title EN",
    subtitle: "Test subtitle EN",
    buttonTitle: "Test button EN",
    features,
  },
});

const getFeatureSections = (config: ReturnType<typeof createHeroFormBuilderConfig>) =>
  config.sections.filter((s) => s.id.startsWith("feature_"));

const getField = (section: any, name: string) => section.fields.find((f: any) => f.name === name);

describe("createHeroFormBuilderConfig", () => {
  const mockData = createMockHeroData([
    {
      type: "hiringChance",
      label: "Hiring Chance",
      value: "90%",
    },
    {
      type: "majors",
      label: "Majors",
      value: "Engineering",
    },
  ]);

  it("should have correct base config", () => {
    const config = createHeroFormBuilderConfig(mockData);

    expect(config.id).toBe("hero");

    expect(config.options).toMatchObject({
      hasImage: true,
      submitText: "Зберегти зміни",
      resetText: "Скасувати правки",
    });
  });

  it("should include base sections", () => {
    const config = createHeroFormBuilderConfig(mockData);

    const ids = config.sections.map((s) => s.id);

    expect(ids).toEqual(expect.arrayContaining(["text-content", "button"]));

    const textSection = config.sections.find((s) => s.id === "text-content");
    const buttonSection = config.sections.find((s) => s.id === "button");

    expect(textSection?.fields.length).toBe(2);
    expect(buttonSection?.fields.length).toBe(1);
  });

  it("should generate dynamic feature sections via map()", () => {
    const config = createHeroFormBuilderConfig(mockData);

    const featureSections = getFeatureSections(config);

    expect(featureSections).toHaveLength(mockData.uk.features.length);

    featureSections.forEach((section, index) => {
      const feature = mockData.uk.features[index];

      expect(section.id).toBe(`feature_${feature.type}`);
      expect(section.group).toBe("hero-features");
      expect(section.localeLayout).toBe("combined");

      const labelField = getField(section, `features.${index}.label`);

      expect(labelField).toBeDefined();
      expect(labelField?.type).toBe("text");
      expect(labelField?.required).toBe(true);

      expect(labelField?.label?.uk).toBe(`${feature.label} - Заголовок`);
      expect(labelField?.label?.en).toBe(`${feature.label} - Title`);

      // value field
      const valueField = getField(section, `features.${index}.value`);

      expect(valueField).toBeDefined();
      expect(valueField?.type).toBe("text");
      expect(valueField?.required).toBe(true);
      expect(valueField?.locales).toEqual(["uk"]);

      expect(valueField?.label?.uk).toBe(`${feature.label} - Значення`);
      expect(valueField?.label?.en).toBe(`${feature.label} - Value`);
    });
  });

  it("should keep feature index alignment stable", () => {
    const config = createHeroFormBuilderConfig(mockData);

    const featureSections = getFeatureSections(config);

    featureSections.forEach((section, i) => {
      expect(section.fields[0].name).toContain(`features.${i}`);
      expect(section.fields[1].name).toContain(`features.${i}`);
    });
  });

  it("should handle empty features safely", () => {
    const config = createHeroFormBuilderConfig(createMockHeroData([]));

    const featureSections = getFeatureSections(config);

    expect(featureSections).toHaveLength(0);
  });

  it("should validate section groups", () => {
    const config = createHeroFormBuilderConfig(mockData);

    expect(config.sectionGroups?.["hero-features"]).toMatchObject({
      className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
      title: "Додатковий контент",
    });
  });

  it("should ensure all fields have valid labels", () => {
    const config = createHeroFormBuilderConfig(mockData);

    config.sections.forEach((section) => {
      section.fields.forEach((field) => {
        expect(field.label).toBeDefined();
        expect(field.label?.uk).toBeTruthy();
        expect(field.label?.en).toBeTruthy();
      });
    });
  });
});
