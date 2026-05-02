import { AdminDataMap } from "../admin-types";
import { FieldConfig, FormBuilderConfig } from "@/lib/form-builder";

type AdminData = AdminDataMap["header-footer"];

const getHeaderSections = (data: AdminData) => {
  const menuFields: FieldConfig[] = data.uk.header.links.map((_, index) => ({
    name: `header.links[${index}].label`,
    type: "text",
    required: true,
  }));

  return [
    {
      id: "text-content",
      group: "header",
      title: "Контент",
      localeLayout: "split" as const,
      fields: [
        { name: "header.logoText", type: "text", label: { uk: "Заголовок", en: "Title" }, required: true },
        {
          name: "header.subLogoText",
          type: "text",
          label: { uk: "Скорочений заголовок", en: "Sub title" },
          required: true,
        },
      ] as FieldConfig[],
    },
    {
      id: "header-button",
      group: "header",
      title: "Кнопка",
      localeLayout: "split" as const,
      fields: [
        {
          name: "header.button.text",
          type: "text",
          label: { uk: "Напис у кнопці", en: "Text on the button" },
          required: true,
        },
        {
          name: "header.button.href",
          type: "text",
          label: { uk: "Посилання для кнопки", en: "Link for the button" },
          required: true,
        },
      ] as FieldConfig[],
    },
    {
      id: "header-menu",
      group: "header",
      title: "Меню навігації",
      localeLayout: "split" as const,
      fields: menuFields,
    },
  ];
};

const footerSections = [
  {
    id: "footer-text",
    group: "footer",
    title: "Контент",
    localeLayout: "split" as const,
    fields: [
      { name: "footer.title", type: "text", label: { uk: "Заголовок", en: "Title" }, required: true },
      {
        name: "footer.description",
        type: "textarea",
        props: { rows: 4 },
        label: { uk: "Опис", en: "Description" },
        required: true,
      },
      { name: "footer.copyright", type: "text", label: { uk: "Авторські права", en: "Copyright" }, required: true },
      {
        name: "footer.copyrightOwner",
        type: "text",
        label: { uk: "Назва військової частини", en: "Name of military unit" },
        required: true,
      },
    ] as FieldConfig[],
  },
];

export const headerFooterFormBuilderConfig = (data: AdminData): FormBuilderConfig => {
  return {
    id: "header",
    sectionGroups: {
      header: {
        className: "flex flex-col gap-8",
        title: "Шапка сайту",
      },
      footer: {
        className: "flex flex-col",
        title: "Підвал сайту",
      },
    },
    options: {
      hasImage: true,
      imageConfig: {
        label: "Логотип",
        maxSize: 5 * 1024 * 1024,
        accept: ["image/jpeg", "image/png", "image/webp"],
      },
      submitText: "Зберегти зміни",
      resetText: "Скасувати правки",
    },

    sections: [...getHeaderSections(data), ...footerSections],
  };
};
