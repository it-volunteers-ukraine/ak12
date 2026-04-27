// 🎓 HERO CONFIG - конфіг для Hero форми (працює з БД)
import { FormBuilderConfig } from "@/lib/form-builder";

export const heroFormBuilderConfig: FormBuilderConfig = {
  id: "hero",
  sectionGroups: {
    "hero-stats": {
      className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
      title: "Додатковий контент ",
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
          type: "",
          required: true,
          label: {
            uk: "Текстовий контент українською",
            en: "Text content in English",
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
      id: "statistics_support",
      localeLayout: "combined",
      group: "hero-stats",
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
          locales: ["uk"],
          required: true,
          label: {
            uk: "Підтримка - Значення",
            en: "Support - Value",
          },
        },
      ],
    },

    {
      id: "statistics_hiringChance",
      localeLayout: "combined",
      group: "hero-stats",
      fields: [
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
          locales: ["uk"],
          required: true,
          label: {
            uk: "Шанс найму - Значення",
            en: "Hiring Chance - Value",
          },
        },
      ],
    },

    {
      id: "statistics_majors",
      group: "hero-stats",
      localeLayout: "combined",
      fields: [
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
          locales: ["uk"],
          required: true,
          label: {
            uk: "Майори - Значення",
            en: "Majors - Value",
          },
        },
      ],
    },
  ],
};
