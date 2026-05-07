import { FormBuilderConfig } from "@/lib/form-builder/types";

export const vacancyFormBuilderConfig: FormBuilderConfig = {
  id: "vacancy",
  options: {
    submitText: "Зберегти зміни",
    resetText: "Скасувати правки",
  },
  sections: [
    {
      id: "vacancy-main",
      localeLayout: "split",
      fields: [
        {
          name: "position",
          type: "text",
          required: true,
          label: { uk: "Назва посади *", en: "Position name *" },
          props: { placeholder: "Починіть писати..." },
        },
        {
          name: "description",
          type: "textarea",
          required: true,
          label: { uk: "Опис вимог *", en: "Requirements *" },
          props: { rows: 6, placeholder: "Починіть писати..." },
        },
      ],
    },
  ],
};