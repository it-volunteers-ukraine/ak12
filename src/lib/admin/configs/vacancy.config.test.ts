import { vacancyFormBuilderConfig } from "@/lib/admin/configs/vacancy.config";

describe("vacancyFormBuilderConfig", () => {
  it("should have correct base structure", () => {
    expect(vacancyFormBuilderConfig.id).toBe("vacancy");

    expect(vacancyFormBuilderConfig.options).toMatchObject({
      submitText: "Зберегти зміни",
      resetText: "Скасувати правки",
    });
  });

  it("should have sections array", () => {
    expect(Array.isArray(vacancyFormBuilderConfig.sections)).toBe(true);
    expect(vacancyFormBuilderConfig.sections.length).toBe(1);
  });

  it("should validate section structure", () => {
    const section = vacancyFormBuilderConfig.sections[0];

    expect(section.id).toBe("vacancy-main");
    expect(section.localeLayout).toBe("split");

    expect(Array.isArray(section.fields)).toBe(true);
    expect(section.fields.length).toBe(2);
  });

  it("should validate position field", () => {
    const section = vacancyFormBuilderConfig.sections[0];

    const field = section.fields.find((f) => f.name === "position");

    expect(field).toBeDefined();

    expect(field).toMatchObject({
      type: "text",
      required: true,
      label: {
        uk: "Назва посади *",
        en: "Position name *",
      },
      props: {
        placeholder: "Починіть писати...",
      },
    });
  });

  it("should validate description field", () => {
    const section = vacancyFormBuilderConfig.sections[0];

    const field = section.fields.find((f) => f.name === "description");

    expect(field).toBeDefined();

    expect(field).toMatchObject({
      type: "textarea",
      required: true,
      label: {
        uk: "Опис вимог *",
        en: "Requirements *",
      },
      props: {
        rows: 6,
        placeholder: "Починіть писати...",
      },
    });
  });

  it("should ensure all fields have required properties", () => {
    const fields = vacancyFormBuilderConfig.sections[0].fields;

    fields.forEach((field) => {
      expect(field.type).toBeDefined();

      if (field.type !== "image" && field.type !== "video") {
        expect((field as any).name).toBeTruthy();
      }

      expect(field.label).toBeDefined();
      expect(field.label?.uk).toBeTruthy();
      expect(field.label?.en).toBeTruthy();
    });
  });
});
