import { FormBuilderConfig } from "@/lib/form-builder";

export const subdivisionFormBuilderConfig: FormBuilderConfig = {
  id: "subdivision",
  options: {
    hasImage: true,
    imageConfig: {
      label: "Фото на сайті (герб)",
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
          name: "name",
          type: "text",
          required: true,
          label: { uk: "Назва підрозділу *", en: "Subdivision name *" },
        },
        {
          name: "siteUrl",
          type: "text",
          label: { uk: "Посилання на сайт", en: "Website URL" },
        },
        {
          name: "hoverName",
          type: "text",
          label: { uk: "Назва (hover)", en: "Name (hover)" },
        },
        {
          name: "description",
          type: "textarea",
          required: true,
          label: { uk: "Короткий опис *", en: "Short description *" },
          props: { rows: 3 },
        },
        {
          name: "hoverDescription",
          type: "textarea",
          label: { uk: "Повний опис (hover)", en: "Full description (hover)" },
          props: { rows: 5 },
        },
      ],
    },
  ],
};

export const subdivisionHoverImageConfig: FormBuilderConfig = {
  id: "subdivision-hover",
  buttonsClassName: "hidden",
  options: {
    hasImage: true,
    imageConfig: {
      label: "Hover фото",
      maxSize: 5 * 1024 * 1024,
      accept: ["image/jpeg", "image/png", "image/webp"],
    },
  },
  sections: [],
};