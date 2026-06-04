import { FormBuilderConfig } from "@/lib/form-builder";
import { SectionConfig } from "@/lib/form-builder/types";

const previewItems = 9;

const baseSections: FormBuilderConfig["sections"] = [
  {
    id: "main-content",
    title: "Основний контент",
    localeLayout: "split",
    fields: [
      {
        name: "mainTitle",
        type: "text",
        required: true,
        label: {
          uk: "Головний заголовок українською",
          en: "Main title in English",
        },
      },
      {
        name: "description",
        type: "textarea",
        required: true,
        label: {
          uk: "Опис українською",
          en: "Description in English",
        },
        props: {
          rows: 5,
        },
      },
    ],
  },
];

export const createAboutFormBuilderConfig = (galleryLength: number): FormBuilderConfig => {
  const gallery = Array.from({ length: galleryLength });

  const preview = gallery.slice(0, previewItems).map<SectionConfig>((_, index) => {
    const isFirst = index === 0;

    return {
      id: `gallery_item_${index}`,
      title: `Елемент галереї #${index + 1}`,
      group: "about-gallery",
      localeLayout: "gallery-3col",
      localeTitles: {
        uk: "Текстовий контент українською ",
        en: "Текстовий контент англійською ",
      },
      fields: [
        {
          id: `gallery-media-${index}`,
          type: "media-selector" as const,
          locales: ["uk"] as const,
          props: { imageIndex: index, videoIndex: index },
          name: `content.gallery.${index}.__media`,
        },
        {
          name: `content.gallery.${index}.text`,
          type: "text",
          required: true,
          label: {
            uk: isFirst ? "Заголовок" : "Опис",
            en: isFirst ? "Заголовок" : "Опис",
          },
        },
      ],
    };
  });

  const otherGallery = gallery.slice(previewItems).map<SectionConfig>((_, i) => {
    const index = i + previewItems;

    return {
      id: `gallery_item_${index}`,
      title: `Елемент галереї #${index + 1}`,
      group: "about-other-gallery",
      localeLayout: "combined",
      hideLocaleBadge: true,
      fields: [
        {
          id: `gallery-media-${index}`,
          type: "media-selector" as const,
          locales: ["uk"] as const,
          props: { imageIndex: index, videoIndex: index },
          name: `content.gallery.${index}.__media`,
        },
      ],
    };
  });

  return {
    id: "about",
    sectionGroups: {
      "about-gallery": {
        className: "grid grid-cols-1 gap-8",
        title: "Галерея",
      },
      "about-other-gallery": {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
        title: "Додаткова галерея",
      },
    },
    options: {
      submitText: "Зберегти зміни",
      resetText: "Скасувати правки",
    },
    sections: [...baseSections, ...preview, ...otherGallery],
  };
};