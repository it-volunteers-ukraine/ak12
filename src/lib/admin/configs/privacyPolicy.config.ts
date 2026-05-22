import { FormBuilderConfig } from "@/lib/form-builder";

export const privacyPolicyFormBuilderConfig: FormBuilderConfig = {
  id: "privacy-policy",
  options: {
    hasImage: false,
    submitText: "Зберегти зміни",
    resetText: "Скасувати правки",
  },
  sections: [
    {
      id: "privacy-policy-title",
      titlePlacement: "outside",
      title: "Редагування заголовка",
      localeLayout: "split",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: {
            uk: "Заголовок українською",
            en: "Title in English",
          },
        },
      ],
    },
    {
      id: "privacy-policy-description",
      titlePlacement: "outside",
      title: "Редагування опису",
      localeLayout: "split",
      fields: [
        {
          name: "description",
          type: "textarea",
          required: true,
          label: {
            uk: "Опис українською",
            en: "Description in English",
          },
          props: {
            rows: 10,
          },
        },
      ],
    },
  ],
};
