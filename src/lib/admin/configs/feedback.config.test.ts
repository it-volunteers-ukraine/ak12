import { feedbackFormBuilderConfig } from "./feedback.config";
import { ContactsField, FormRadioButton, SocialLinksField } from "@/components/admin/admin-form-elements";
import { FieldConfig, SectionConfig } from "@/lib/form-builder/types";

type Config = typeof feedbackFormBuilderConfig;

const getSectionById = (config: Config, id: string): SectionConfig | undefined =>
  config.sections.find((s) => s.id === id);

const getSectionByIdAndGroup = (config: Config, id: string, group: string): SectionConfig | undefined =>
  config.sections.find((s) => s.id === id && s.group === group);

const getGroupSections = (config: Config, group: string): SectionConfig[] =>
  config.sections.filter((s) => s.group === group);

const getCustomField = (section?: SectionConfig, name?: string): FieldConfig | undefined =>
  section?.fields?.find((f) => f?.name === name);

describe("feedbackFormBuilderConfig", () => {
  const config = feedbackFormBuilderConfig;

  it("should have correct base config", () => {
    expect(config.id).toBe("feedback");

    expect(config.options).toMatchObject({
      hasImage: false,
      submitText: "Зберегти зміни",
      resetText: "Скасувати правки",
    });
  });

  it("should contain all section groups", () => {
    expect(config.sectionGroups).toMatchObject({
      contacts: {
        title: "Контакти",
        className: "flex flex-col gap-8",
      },
      form: {
        title: "Секція форми зворотнього зв'язку",
        className: "flex flex-col",
      },
      subSection: {
        title: "Міні-секції",
        className: "flex flex-col",
      },
    });
  });

  it("should merge all sections correctly (spread validation)", () => {
    const groups = ["contacts", "form", "subSection"] as const;

    const totalSections = groups.reduce((sum, g) => sum + getGroupSections(config, g).length, 0);

    expect(config.sections.length).toBe(totalSections);
  });

  it("should correctly register custom components in contacts", () => {
    const socialSection = getSectionById(config, "social");
    const contactSection = getSectionById(config, "contact");

    expect(socialSection).toBeDefined();
    expect(contactSection).toBeDefined();

    const socialField = getCustomField(socialSection, "contacts.socialLinks");
    const contactField = getCustomField(contactSection, "contacts.info");

    expect(socialField?.type).toBe("custom");
    expect(socialField?.component).toBe(SocialLinksField);

    expect(contactField?.type).toBe("custom");
    expect(contactField?.component).toBe(ContactsField);
  });

  it("should validate form section fields", () => {
    const formSection = getSectionByIdAndGroup(config, "text", "form");

    expect(formSection).toBeDefined();
    if (!formSection) {
      return;
    }

    expect(formSection.group).toBe("form");

    const requiredFields = formSection.fields.filter((f) => f.required);

    expect(requiredFields.length).toBe(8);

    const radio = getCustomField(formSection, "form.radioButtons");

    expect(radio?.type).toBe("custom");
    expect(radio?.component).toBe(FormRadioButton);
  });

  it("should validate subsection fields structure", () => {
    const subSection = getSectionByIdAndGroup(config, "text", "subSection");

    expect(subSection).toBeDefined();
    if (!subSection) {
      return;
    }

    expect(subSection.group).toBe("subSection");

    subSection.fields.forEach((field) => {
      expect(field.name).toBeTruthy();
      expect(field.type).toBe("text");

      if (field.label) {
        expect(field.label.uk).toBeTruthy();
        expect(field.label.en).toBeTruthy();
      }
    });
  });

  it("should ensure all sections have valid structure", () => {
    config.sections.forEach((section) => {
      expect(section.id).toBeTruthy();
      expect(Array.isArray(section.fields)).toBe(true);

      section.fields.forEach((field) => {
        expect(field.name).toBeTruthy();
        expect(field.type).toBeTruthy();
      });
    });
  });
});
