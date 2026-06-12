import { contract1824FormBuilderConfig } from "./contract1824.config";

const getSection = (id: string) => contract1824FormBuilderConfig.sections.find((s) => s.id === id);

const getGroup = (group: string) => contract1824FormBuilderConfig.sections.filter((s) => s.group === group);

const getField = (section: any, name: string) => section.fields.find((f: any) => f.name === name);

describe("contract1824FormBuilderConfig", () => {
  it("should have correct base config", () => {
    expect(contract1824FormBuilderConfig.id).toBe("contract-18-24");

    expect(contract1824FormBuilderConfig.options).toMatchObject({
      hasImage: true,
      submitText: "Зберегти зміни",
      resetText: "Скасувати правки",
    });
  });

  it("should contain section groups", () => {
    expect(contract1824FormBuilderConfig.sectionGroups).toMatchObject({
      "contract-stats": {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
        title: "Додатковий контент ",
      },
    });
  });

  it("should include base sections", () => {
    const title = getSection("title-text");
    const text = getSection("text-content");
    const contact = getSection("contact");

    expect(title).toBeDefined();
    expect(text).toBeDefined();
    expect(contact).toBeDefined();

    expect(title?.fields.length).toBe(3);
    expect(text?.fields.length).toBe(2);
    expect(contact?.fields.length).toBe(3);
  });

  it("should correctly map contract-stats group sections", () => {
    const stats = getGroup("contract-stats");

    expect(stats.length).toBe(3);

    stats.forEach((section, index) => {
      expect(section.localeLayout).toBe("combined");

      const titleField = getField(section, `content.${index}.title`);
      const subtitleField = getField(section, `content.${index}.subtitle`);

      expect(titleField).toBeDefined();
      expect(subtitleField).toBeDefined();

      expect(titleField?.type).toBe("text");
      expect(subtitleField?.type).toBe("textarea");

      expect(titleField?.required).toBe(true);
      expect(subtitleField?.required).toBe(true);

      expect(titleField?.label?.uk).toContain("Заголовок картки");
    });
  });

  it("should validate button section structure", () => {
    const section = getSection("button");

    expect(section).toBeDefined();
    expect(section?.fields.length).toBe(2);

    const joinBtn = getField(section, "baseSection.buttonJoinUs");
    const message = getField(section, "baseSection.message");

    expect(joinBtn).toBeDefined();
    expect(message).toBeDefined();

    expect(joinBtn?.type).toBe("text");
    expect(message?.type).toBe("textarea");
  });

  it("should validate image content section", () => {
    const section = getSection("img-content");

    expect(section).toBeDefined();
    expect(section?.title).toContain("фото");

    expect(section?.fields).toEqual([
      {
        name: "imgContent.title",
        type: "text",
        required: true,
        label: {
          uk: "Заголовок блоку з фото",
          en: "Image block title",
        },
      },
      {
        name: "imgContent.subtitle",
        type: "text",
        required: true,
        label: {
          uk: "Опис блоку з фото",
          en: "Image block subtitle",
        },
      },
    ]);
  });

  it("should ensure all sections have valid structure", () => {
    contract1824FormBuilderConfig.sections.forEach((section) => {
      expect(section.id).toBeTruthy();
      expect(Array.isArray(section.fields)).toBe(true);

      section.fields.forEach((field) => {
        expect(field.name).toBeTruthy();
        expect(field.type).toBeTruthy();
      });
    });
  });
});
