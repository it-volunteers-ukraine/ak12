import { subdivisionFormBuilderConfig } from "./subdivision.config";

describe("subdivisionFormBuilderConfig", () => {
  it("should have correct base structure", () => {
    expect(subdivisionFormBuilderConfig.id).toBe("subdivision");

    expect(subdivisionFormBuilderConfig.options).toMatchObject({
      hasImage: true,
      submitText: "Зберегти зміни",
      resetText: "Скасувати правки",
    });
  });

  it("should have valid image configuration", () => {
    expect(subdivisionFormBuilderConfig.options?.imageConfig).toMatchObject({
      label: "Фото на сайті (герб)",
      maxSize: 5 * 1024 * 1024,
      accept: ["image/jpeg", "image/png", "image/webp"],
    });
  });

  it("should have exactly one section", () => {
    expect(subdivisionFormBuilderConfig.sections).toHaveLength(1);
  });

  it("should validate text-content section structure", () => {
    const section = subdivisionFormBuilderConfig.sections[0];

    expect(section.id).toBe("text-content");
    expect(section.title).toBe("Текстовий контент");
    expect(section.localeLayout).toBe("split");

    expect(Array.isArray(section.fields)).toBe(true);
    expect(section.fields.length).toBe(5);
  });

  it("should validate required fields", () => {
    const fields = subdivisionFormBuilderConfig.sections[0].fields;

    const nameField = fields.find((f) => f.name === "name");
    const descriptionField = fields.find((f) => f.name === "description");

    expect(nameField).toMatchObject({
      type: "text",
      required: true,
      label: {
        uk: "Назва підрозділу *",
        en: "Subdivision name *",
      },
    });

    expect(descriptionField).toMatchObject({
      type: "textarea",
      required: true,
      label: {
        uk: "Короткий опис *",
        en: "Short description *",
      },
      props: {
        rows: 3,
      },
    });
  });

  it("should validate optional fields existence", () => {
    const fields = subdivisionFormBuilderConfig.sections[0].fields;

    const siteUrl = fields.find((f) => f.name === "siteUrl");
    const hoverName = fields.find((f) => f.name === "hoverName");
    const hoverDescription = fields.find((f) => f.name === "hoverDescription");

    expect(siteUrl).toBeDefined();
    expect(hoverName).toBeDefined();
    expect(hoverDescription).toBeDefined();

    expect(siteUrl?.required ?? false).toBe(false);
    expect(hoverName?.required ?? false).toBe(false);
    expect(hoverDescription?.required ?? false).toBe(false);
  });

  it("should ensure all fields have bilingual labels", () => {
    const fields = subdivisionFormBuilderConfig.sections[0].fields;

    fields.forEach((field) => {
      expect(field.label).toBeDefined();
      expect(field.label?.uk).toBeTruthy();
      expect(field.label?.en).toBeTruthy();
    });
  });
});
