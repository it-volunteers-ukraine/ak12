// 🎓 HERO CONFIG - конфіг для Hero форми (працює з БД)
import { AdminDataMap } from "@/lib/admin/admin-types";
import { FormBuilderConfig } from "@/lib/form-builder";
import { SectionConfig } from "@/lib/form-builder/types";

type HeroData = AdminDataMap["hero"];

const baseSections: FormBuilderConfig["sections"] = [
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
];

export const createHeroFormBuilderConfig = (data: HeroData): FormBuilderConfig => ({
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
    ...baseSections,
    ...(data.uk?.features ?? []).map<SectionConfig>((feature, index) => ({
      id: `feature_${feature.type}`,
      localeLayout: "combined",
      group: "hero-features",
      fields: [
        {
          name: `features.${index}.label`,
          type: "text",
          required: true,
          label: {
            uk: `${feature.label} - Заголовок`,
            en: `${feature.label} - Title`,
          },
        },
        {
          name: `features.${index}.value`,
          type: "text",
          required: true,
          locales: ["uk"],
          label: {
            uk: `${feature.label} - Значення`,
            en: `${feature.label} - Value`,
          },
        },
      ],
    })),
  ],
});
