import { FormBuilderConfig } from "@/lib/form-builder";

export const contract1824FormBuilderConfig: FormBuilderConfig = {
  id: "contract1824",
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
      title: "Основний контент",
      fields: [
        {
          name: "title",
          type: "textarea",
          required: true,
          label: {
            uk: "Заголовок українською",
            en: "Title in English",
          },
          props: {
            rows: 3,
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
      title: "Контакт",
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
      title: "Контент блоку з фото",
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
          type: "textarea",
          required: true,
          label: {
            uk: "Опис блоку з фото",
            en: "Image block subtitle",
          },
          props: {
            rows: 4,
          },
        },
      ],
    },
  ],
};
