import { privacyPolicyFormBuilderConfig } from "./privacyPolicy.config";

describe("privacyPolicyFormBuilderConfig", () => {
  it("should have correct base structure", () => {
    expect(privacyPolicyFormBuilderConfig.id).toBe("privacy-policy");

    expect(privacyPolicyFormBuilderConfig.options).toMatchObject({
      hasImage: false,
      submitText: "Зберегти зміни",
      resetText: "Скасувати правки",
    });
  });

  it("should have exactly 2 sections", () => {
    expect(privacyPolicyFormBuilderConfig.sections).toHaveLength(2);
  });

  it("should validate title section", () => {
    const section = privacyPolicyFormBuilderConfig.sections.find((s) => s.id === "privacy-policy-title");

    expect(section).toBeDefined();

    expect(section).toMatchObject({
      id: "privacy-policy-title",
      titlePlacement: "outside",
      title: "Редагування заголовка",
      localeLayout: "split",
    });

    expect(section?.fields).toHaveLength(1);

    const field = section?.fields[0];

    expect(field).toMatchObject({
      name: "title",
      type: "text",
      required: true,
      label: {
        uk: "Заголовок українською",
        en: "Title in English",
      },
    });
  });

  it("should validate description section", () => {
    const section = privacyPolicyFormBuilderConfig.sections.find((s) => s.id === "privacy-policy-description");

    expect(section).toBeDefined();

    expect(section?.title).toBe("Редагування опису");
    expect(section?.localeLayout).toBe("split");

    const field = section?.fields?.find((f) => f.name === "description");

    expect(field).toMatchObject({
      type: "textarea",
      required: true,
      label: {
        uk: "Опис українською",
        en: "Description in English",
      },
      props: {
        rows: 10,
      },
    });
  });

  it("should ensure all fields have bilingual labels", () => {
    privacyPolicyFormBuilderConfig.sections.forEach((section) => {
      section.fields.forEach((field) => {
        expect(field.label).toBeDefined();
        expect(field.label?.uk).toBeTruthy();
        expect(field.label?.en).toBeTruthy();
      });
    });
  });

  it("should ensure no image usage is enabled", () => {
    expect(privacyPolicyFormBuilderConfig.options?.hasImage).toBe(false);
  });
});
