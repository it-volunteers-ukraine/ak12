import { FormBuilderConfig } from "@/lib/form-builder";

export const mobilizationFormBuilderConfig: FormBuilderConfig = {
  id: "mobilization",
  options: {
    hasImage: false,
    submitText: "Зберегти зміни",
    resetText: "Скасувати правки",
  },
  sections: [
    {
      id: "title-text",
      titlePlacement: "outside",
      title: "Редагування заголовків",
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
        {
          name: "subtitle",
          type: "textarea",
          required: true,
          label: {
            uk: "Підзаголовок українською",
            en: "Subtitle in English",
          },
          props: {
            rows: 2,
          },
        },
      ],
    },
    {
      id: "content",
      titlePlacement: "outside",
      title: "Редагування текстового контенту",
      fields: [
        {
          name: "content",
          type: "textarea",
          required: true,
          label: {
            uk: "Текстовий контент українською",
            en: "Text content in English",
          },
          props: {
            rows: 4,
          },
        },
      ],
    },
    {
      id: "button",
      titlePlacement: "outside",
      title: "Редагування кнопки",
      fields: [
        {
          name: "buttonTitle",
          type: "text",
          required: true,
          label: {
            uk: "Текст кнопки українською",
            en: "Button text in English",
          },
        },
      ],
    },
  ],
};
