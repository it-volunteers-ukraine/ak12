import { FormBuilderConfig } from "@/lib/form-builder";

export const mobilizationFormBuilderConfig: FormBuilderConfig = {
  id: "mobilization",
  sectionGroups: {
    cards: {
      title: "Редагування карток",
      className: "flex flex-col gap-8",
    },
  },
  options: {
    hasImage: false,
    submitText: "Зберегти зміни",
    resetText: "Скасувати правки",
  },
  sections: [
    {
      id: "title-text",
      titlePlacement: "outside",
      title: "Заголовок секції",
      fields: [
        {
          name: "baseSection.sectionTitle",
          type: "text",
          required: true,
          label: {
            uk: "Заголовок",
            en: "Title",
          },
        },
        {
          name: "baseSection.sectionSubtitle",
          type: "textarea",
          required: true,
          label: {
            uk: "Підзаголовок",
            en: "Subtitle",
          },
          props: {
            rows: 2,
          },
        },
        {
          name: "baseSection.menuButton",
          type: "text",
          required: true,
          label: {
            uk: "Текст кнопки",
            en: "Button text",
          },
        },
      ],
    },
    {
      id: "card-1",
      group: "cards",
      title: "Картка 1",
      fields: [
        {
          name: "cards[0].title",
          type: "text",
          required: true,
          label: {
            uk: "Заголовок",
            en: "Title",
          },
        },
        {
          name: "cards[0].subtitle",
          type: "textarea",
          required: true,
          label: {
            uk: "Підзаголовок",
            en: "Subtitle",
          },
          props: {
            rows: 2,
          },
        },
        {
          name: "cards[0].primaryDescription",
          type: "textarea",
          required: true,
          label: {
            uk: "Текст картки",
            en: "Text card",
          },
          props: {
            rows: 2,
          },
        },
        {
          name: "cards[0].secondaryDescription",
          type: "textarea",
          required: false,
          label: {
            uk: "Текст картки",
            en: "Text card",
          },
          props: {
            rows: 2,
          },
        },
      ],
    },
    {
      id: "card-2",
      group: "cards",
      title: "Картка 2",
      fields: [
        {
          name: "cards[1].title",
          type: "text",
          required: true,
          label: {
            uk: "Заголовок",
            en: "Title",
          },
        },
        {
          name: "cards[1].subtitle",
          type: "textarea",
          required: true,
          label: {
            uk: "Підзаголовок",
            en: "Subtitle",
          },
          props: {
            rows: 2,
          },
        },
        {
          name: "cards[1].primaryDescription",
          type: "textarea",
          required: true,
          label: {
            uk: "Текст картки",
            en: "Text card",
          },
          props: {
            rows: 2,
          },
        },
        {
          name: "cards[1].secondaryDescription",
          type: "textarea",
          required: false,
          label: {
            uk: "Текст картки",
            en: "Text card",
          },
          props: {
            rows: 2,
          },
        },
      ],
    },
    {
      id: "card-3",
      group: "cards",
      title: "Картка 3",
      fields: [
        {
          name: "cards[2].title",
          type: "text",
          required: true,
          label: {
            uk: "Заголовок",
            en: "Title",
          },
        },
        {
          name: "cards[2].subtitle",
          type: "textarea",
          required: true,
          label: {
            uk: "Підзаголовок",
            en: "Subtitle",
          },
          props: {
            rows: 2,
          },
        },
        {
          name: "cards[2].primaryDescription",
          type: "textarea",
          required: true,
          label: {
            uk: "Текст картки",
            en: "Text card",
          },
          props: {
            rows: 2,
          },
        },
        {
          name: "cards[2].secondaryDescription",
          type: "textarea",
          required: false,
          label: {
            uk: "Текст картки",
            en: "Text card",
          },
          props: {
            rows: 2,
          },
        },
      ],
    },
    {
      id: "card-4",
      group: "cards",
      title: "Картка 4",
      fields: [
        {
          name: "cards[3].title",
          type: "text",
          required: true,
          label: {
            uk: "Заголовок",
            en: "Title",
          },
        },
        {
          name: "cards[3].subtitle",
          type: "textarea",
          required: true,
          label: {
            uk: "Підзаголовок",
            en: "Subtitle",
          },
          props: {
            rows: 2,
          },
        },
        {
          name: "cards[3].primaryDescription",
          type: "textarea",
          required: true,
          label: {
            uk: "Текст картки",
            en: "Text card",
          },
          props: {
            rows: 2,
          },
        },
        {
          name: "cards[3].secondaryDescription",
          type: "textarea",
          required: false,
          label: {
            uk: "Текст картки",
            en: "Text card",
          },
          props: {
            rows: 2,
          },
        },
      ],
    },
    {
      id: "button",
      titlePlacement: "outside",
      title: "Редагування кнопки Приєднатися",
      fields: [
        {
          name: "baseSection.buttonJoinUs",
          type: "text",
          required: true,
          label: {
            uk: "Текст кнопки",
            en: "Button text",
          },
        },
        {
          name: "baseSection.message",
          type: "textarea",
          required: true,
          label: {
            uk: "Текст повідомлення при відправці форми",
            en: "Message on form submission",
          },
          props: {
            rows: 2,
          },
        },
      ],
    },
    {
      id: "subsection-description",
      titlePlacement: "outside",
      title: "Редагування нижнього блоку",
      fields: [
        {
          name: "primaryDescription",
          type: "textarea",
          required: true,
          label: {
            uk: "Основний опис",
            en: "Primary description",
          },
          props: {
            rows: 2,
          },
        },
        {
          name: "accentedDescription",
          type: "textarea",
          required: true,
          label: {
            uk: "Акцентований опис",
            en: "Accented description",
          },
          props: {
            rows: 2,
          },
        },
        {
          name: "secondaryDescription",
          type: "text",
          required: true,
          label: {
            uk: "Додатковий опис",
            en: "Secondary description",
          },
        },
      ],
    },
  ],
};
