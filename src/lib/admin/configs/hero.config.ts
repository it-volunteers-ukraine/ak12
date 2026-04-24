// 🎓 HERO CONFIG - конфіг для Hero форми (працює з БД)

import { FormBuilderConfig } from "@/lib/form-builder";

export const heroFormBuilderConfig: FormBuilderConfig = {
  id: "hero",
  
  options: {
    hasImage: true,
    imageConfig: {
      label: "Фото на сайті",
      maxSize: 5 * 1024 * 1024,
      accept: ["image/jpeg", "image/png", "image/webp"],
    },
    submitText: "Зберегти зміни",
    resetText: "Скасувати правки",
  },
  
  sections: [
    {
      id: "text-content",
      title: "Текстовий контент",
      fields: [
        {
          name: "title",
          type: "textarea",
          required: true,
          label: {
            uk: "Текстовий контент українською",
            en: "Text content in English",
          },
          props: {
            rows: 3,
          },
        },
      ],
    },
    
    {
      id: "statistics",
      title: "Статистичні дані",
      fields: [
        {
          name: "support.title",
          type: "text",
          required: true,
          label: {
            uk: "Підтримка - Заголовок",
            en: "Support - Title",
          },
        },
        {
          name: "support.value",
          type: "text",
          required: true,
          label: {
            uk: "Підтримка - Значення",
            en: "Support - Value",
          },
        },
        
        {
          name: "majors.title",
          type: "text",
          required: true,
          label: {
            uk: "Майори - Заголовок",
            en: "Majors - Title",
          },
        },
        {
          name: "majors.value",
          type: "text",
          required: true,
          label: {
            uk: "Майори - Значення",
            en: "Majors - Value",
          },
        },
        {
          name: "hiringChance.title",
          type: "text",
          required: true,
          label: {
            uk: "Шанс найму - Заголовок",
            en: "Hiring Chance - Title",
          },
        },
        {
          name: "hiringChance.value",
          type: "text",
          required: true,
          label: {
            uk: "Шанс найму - Значення",
            en: "Hiring Chance - Value",
          },
        },
      ],
    },
    
    {
      id: "subtitle",
      fields: [
        {
          name: "subtitle",
          type: "textarea",
          required: true,
          label: {
            uk: "Підзаголовок українською",
            en: "Subtitle in English",
          },
          props: {
            rows: 3,
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

