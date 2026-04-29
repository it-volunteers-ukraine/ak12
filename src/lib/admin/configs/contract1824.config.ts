import { FormBuilderConfig } from "@/lib/form-builder";

export const contract1824FormBuilderConfig: FormBuilderConfig = {
  id: "contract-18-24",
  sectionGroups: {
    "contract-stats": {
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
      localeLayout: "split",
      title: "Основний контент",
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
            rows: 3,
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
    {
      id: "contact",
      titlePlacement: "outside",
      title: "Редагування контактів",
      fields: [
        {
          name: "contact.startText",
          type: "text",
          required: true,
          label: {
            uk: "Початковий текст контакту",
            en: "Contact prefix text",
          },
        },
        {
          name: "contact.number",
          type: "text",
          required: true,
          label: {
            uk: "Номер контакту",
            en: "Contact number",
          },
        },
        {
          name: "contact.endText",
          type: "text",
          required: true,
          label: {
            uk: "Кінцевий текст контакту",
            en: "Contact suffix text",
          },
        },
      ],
    },
    {
      id: "content-1",
      group: "contract-stats",
      localeLayout: "combined",

      title: "Картка контенту 1",
      fields: [
        {
          name: "content.0.title",
          type: "text",
          required: true,
          label: {
            uk: "Заголовок картки 1",
            en: "Card 1 title",
          },
        },
        {
          name: "content.0.subtitle",
          type: "textarea",
          required: true,
          label: {
            uk: "Опис картки 1",
            en: "Card 1 subtitle",
          },
          props: {
            rows: 3,
          },
        },
      ],
    },
    {
      id: "content-2",
      group: "contract-stats",
      localeLayout: "combined",
      title: "Картка контенту 2",
      fields: [
        {
          name: "content.1.title",
          type: "text",
          required: true,
          label: {
            uk: "Заголовок картки 2",
            en: "Card 2 title",
          },
        },
        {
          name: "content.1.subtitle",
          type: "textarea",
          required: true,
          label: {
            uk: "Опис картки 2",
            en: "Card 2 subtitle",
          },
          props: {
            rows: 3,
          },
        },
      ],
    },
    {
      id: "content-3",
      group: "contract-stats",
      localeLayout: "combined",
      title: "Картка контенту 3",
      fields: [
        {
          name: "content.2.title",
          type: "text",
          required: true,
          label: {
            uk: "Заголовок картки 3",
            en: "Card 3 title",
          },
        },
        {
          name: "content.2.subtitle",
          type: "textarea",
          required: true,
          label: {
            uk: "Опис картки 3",
            en: "Card 3 subtitle",
          },
          props: {
            rows: 3,
          },
        },
      ],
    },
    {
      id: "img-content",
      titlePlacement: "outside",
      title: "Редагування контенту блоку з фото",
      fields: [
        {
          name: "imgContent.title",
          type: "text",
          required: true,
          label: {
            uk: "Заголовок блоку з фото",
            en: "Image block title",
          },
        },
        {
          name: "imgContent.subtitle",
          type: "text",
          required: true,
          label: {
            uk: "Опис блоку з фото",
            en: "Image block subtitle",
          },
        },
      ],
    },
  ],
};
