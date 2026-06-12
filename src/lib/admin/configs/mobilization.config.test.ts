import { mobilizationFormBuilderConfig } from "./mobilization.config";

describe("mobilizationFormBuilderConfig", () => {
  it("should have correct base structure", () => {
    expect(mobilizationFormBuilderConfig.id).toBe("mobilization");

    expect(mobilizationFormBuilderConfig.options).toMatchObject({
      hasImage: false,
      submitText: "Зберегти зміни",
      resetText: "Скасувати правки",
    });
  });

  it("should have section groups defined", () => {
    expect(mobilizationFormBuilderConfig.sectionGroups).toBeDefined();

    expect(mobilizationFormBuilderConfig.sectionGroups?.cards).toMatchObject({
      title: "Редагування карток",
      className: "flex flex-col gap-8",
    });
  });

  it("should have title-text section", () => {
    const section = mobilizationFormBuilderConfig.sections.find((s) => s.id === "title-text");

    expect(section).toBeDefined();

    expect(section?.fields.length).toBe(3);

    const title = section?.fields.find((f) => f.name === "baseSection.sectionTitle");

    const subtitle = section?.fields.find((f) => f.name === "baseSection.sectionSubtitle");

    const button = section?.fields.find((f) => f.name === "baseSection.menuButton");

    expect(title?.required).toBe(true);
    expect(subtitle?.props?.rows).toBe(2);
    expect(button?.type).toBe("text");
  });

  it("should validate all card sections (1–4)", () => {
    for (let i = 0; i < 4; i++) {
      const section = mobilizationFormBuilderConfig.sections.find((s) => s.id === `card-${i + 1}`);

      expect(section).toBeDefined();
      expect(section?.group).toBe("cards");

      const title = section?.fields.find((f) => f.name === `cards[${i}].title`);

      const subtitle = section?.fields.find((f) => f.name === `cards[${i}].subtitle`);

      const primary = section?.fields.find((f) => f.name === `cards[${i}].primaryDescription`);

      const secondary = section?.fields.find((f) => f.name === `cards[${i}].secondaryDescription`);

      expect(title?.required).toBe(true);
      expect(subtitle?.props?.rows).toBe(2);
      expect(primary?.required).toBe(true);
      expect(secondary?.required).toBe(false);
    }
  });

  it("should validate button section", () => {
    const section = mobilizationFormBuilderConfig.sections.find((s) => s.id === "button");

    expect(section).toBeDefined();

    const button = section?.fields.find((f) => f.name === "baseSection.buttonJoinUs");

    const message = section?.fields.find((f) => f.name === "baseSection.message");

    expect(button?.type).toBe("text");
    expect(message?.type).toBe("textarea");
    expect(message?.props?.rows).toBe(2);
  });

  it("should validate subsection-description", () => {
    const section = mobilizationFormBuilderConfig.sections.find((s) => s.id === "subsection-description");

    expect(section).toBeDefined();
    expect(section?.fields.length).toBe(3);

    const primary = section?.fields.find((f) => f.name === "primaryDescription");

    const accented = section?.fields.find((f) => f.name === "accentedDescription");

    const secondary = section?.fields.find((f) => f.name === "secondaryDescription");

    expect(primary?.type).toBe("text");
    expect(accented?.type).toBe("text");
    expect(secondary?.type).toBe("textarea");
    expect(secondary?.props?.rows).toBe(3);
  });

  it("should ensure all fields have bilingual labels", () => {
    mobilizationFormBuilderConfig.sections.forEach((section) => {
      section.fields.forEach((field) => {
        expect(field.label).toBeDefined();
        expect(field.label?.uk).toBeTruthy();
        expect(field.label?.en).toBeTruthy();
      });
    });
  });
});
