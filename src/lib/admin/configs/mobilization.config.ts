
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
