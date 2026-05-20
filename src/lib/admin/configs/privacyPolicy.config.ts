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
      id: "privacy-policy",
      titlePlacement: "outside",
      title: "Редагування політики конфіденційності",
      localeLayout: "split",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: {
            uk: "Заголовок",
            en: "Title",
          },
        },
        {
          name: "description",
          type: "textarea",
          required: true,
          label: {
            uk: "Опис",
            en: "Description",
          },
          props: {
            rows: 5,
          },
        },
      ],
    },
  ],
};
