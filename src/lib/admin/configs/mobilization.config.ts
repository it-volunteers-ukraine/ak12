
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
      id: "titles",
      layout: "row",
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
      id: "subtitle",
      layout: "row",
      fields: [
        {
          name: "subtitle",
          type: "text",
          required: true,
          label: {
            uk: "Підзаголовок українською",
            en: "Subtitle in English",
          },
        },
      ],
    },
    {
      id: "content",
      layout: "row",
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
            rows: 6,
          },
        },
      ],
    },
    {
      id: "button",
      title: "Редагування кнопки",
      layout: "row",
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
