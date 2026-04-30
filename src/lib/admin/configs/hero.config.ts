// 🎓 HERO CONFIG - конфіг для Hero форми (працює з БД)
import { FormBuilderConfig } from "@/lib/form-builder";

export const heroFormBuilderConfig: FormBuilderConfig = {
  id: "hero",
  sectionGroups: {
    "hero-features": {
      className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
      title: "Додатковий контент",
    },
  },

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
        {
          name: "subtitle",
          type: "textarea",
          required: true,
          label: {
            uk: "Підзаголовок українською",
            en: "Subtitle in English",
          },
        },
      ],
    },
    {
      id: "button",
      title: "Редагування кнопки",
      titlePlacement: "outside",
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
    {
      id: "feature_hiring_chance",
      localeLayout: "combined",
      group: "hero-features",
      fields: [
        {
          name: "features.0.label",
          type: "text",
          required: true,
          label: {
            uk: "Шанс найму - Заголовок",
            en: "Hiring Chance - Title",
          },
        },
        {
          name: "features.0.value",
          type: "text",
          required: true,
          locales: ["uk"],
          label: {
            uk: "Шанс найму - Значення",
            en: "Hiring Chance - Value",
          },
        },
      ],
    },
    {
      id: "feature_majors",
      localeLayout: "combined",
      group: "hero-features",
      fields: [
        {
          name: "features.1.label",
          type: "text",
          required: true,
          label: {
            uk: "Спеціальності - Заголовок",
            en: "Majors - Title",
          },
        },
        {
          name: "features.1.value",
          type: "text",
          required: true,
          locales: ["uk"],
          label: {
            uk: "Спеціальності - Значення",
            en: "Majors - Value",
          },
        },
      ],
    },
    {
      id: "feature_support",
      localeLayout: "combined",
      group: "hero-features",
      fields: [
        {
          name: "features.2.label",
          type: "text",
          required: true,
          label: {
            uk: "Підтримка - Заголовок",
            en: "Support - Title",
          },
        },
        {
          name: "features.2.value",
          type: "text",
          required: true,
          locales: ["uk"],
          label: {
            uk: "Підтримка - Значення",
            en: "Support - Value",
          },
        },
      ],
    },
  ],
};
