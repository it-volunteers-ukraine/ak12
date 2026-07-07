import { transferConfig } from "@/lib/admin/configs/transfer.config";

describe("transferConfig", () => {
  it("should have correct base structure", () => {
    expect(transferConfig.id).toBe("transfer");

    expect(transferConfig.options).toMatchObject({
      hasImage: true,
      submitText: "Зберегти зміни",
      resetText: "Скасувати правки",
    });
  });

  it("should have image configuration", () => {
    expect(transferConfig.options?.imageConfig).toMatchObject({
      label: "Фото на сайті",
      maxSize: 5 * 1024 * 1024,
      accept: ["image/jpeg", "image/png", "image/webp"],
    });
  });

  it("should have section groups defined", () => {
    expect(transferConfig.sectionGroups).toBeDefined();

    expect(transferConfig.sectionGroups?.["transfer-stats"]).toMatchObject({
      className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
      title: "Додатковий контент ",
    });
  });

  it("should have correct number of sections", () => {
    expect(transferConfig.sections.length).toBeGreaterThan(0);
  });

  it("should validate title-text section", () => {
    const section = transferConfig.sections.find((s) => s.id === "title-text");

    expect(section).toBeDefined();

    expect(section).toMatchObject({
      id: "title-text",
      titlePlacement: "outside",
      title: "Заголовок секції",
    });

    expect(section?.fields.length).toBe(3);
  });

  it("should validate text-content section", () => {
    const section = transferConfig.sections.find((s) => s.id === "text-content");

    expect(section?.localeLayout).toBe("split");

    const titleField = section?.fields.find((f) => f.name === "title");

    expect(titleField).toMatchObject({
      type: "text",
      required: true,
      label: {
        uk: "Заголовок",
        en: "Title",
      },
    });
  });

  it("should validate transferLink section", () => {
    const section = transferConfig.sections.find((s) => s.id === "transferLink");

    expect(section).toBeDefined();
    expect(section?.fields.length).toBe(3);

    const linkField = section?.fields.find((f) => f.name === "transferLink.link");

    expect(linkField).toMatchObject({
      type: "text",
      required: true,
      label: {
        uk: "Номер контакту",
        en: "Contact number",
      },
    });
  });

  it("should validate content cards structure", () => {
    const sections = transferConfig.sections.filter((s) => s.id.startsWith("content-"));

    expect(sections.length).toBe(3);

    sections.forEach((section, index) => {
      const titleField = section.fields.find((f) => f.name === `content.${index}.title`);

      const subtitleField = section.fields.find((f) => f.name === `content.${index}.subtitle`);

      expect(titleField).toBeDefined();
      expect(subtitleField).toBeDefined();

      expect(titleField?.required).toBe(true);
      expect(subtitleField?.props?.rows).toBe(3);
    });
  });

  it("should validate button section", () => {
    const section = transferConfig.sections.find((s) => s.id === "button");

    expect(section).toBeDefined();

    const buttonField = section?.fields.find((f) => f.name === "baseSection.buttonJoinUs");

    const messageField = section?.fields.find((f) => f.name === "baseSection.message");

    expect(buttonField?.type).toBe("text");
    expect(messageField?.type).toBe("textarea");

    expect(buttonField?.label?.uk).toBeTruthy();
    expect(messageField?.label?.en).toBeTruthy();
  });

  it("should ensure all fields have valid labels", () => {
    transferConfig.sections.forEach((section) => {
      section.fields.forEach((field) => {
        expect(field.label).toBeDefined();
        expect(field.label?.uk).toBeTruthy();
        expect(field.label?.en).toBeTruthy();
      });
    });
  });
});
