import { FieldConfig, FormBuilderConfig } from "@/lib/form-builder";
import { ContactsField, FormRadioButton, SocialLinksField } from "@/components/admin/admin-form-elements";

const contacts = [
  {
    id: "social",
    group: "contacts",
    localeLayout: "split",
    title: "Редагування соціальних мереж",
    fields: [
      {
        name: "contacts.socialLinks",
        type: "custom",
        component: SocialLinksField,
        required: false,
      },
    ] as FieldConfig[],
  },
  {
    id: "contact",
    group: "contacts",
    localeLayout: "split",
    title: "Редагування контактів",
    fields: [
      {
        name: "contacts.info",
        type: "custom",
        component: ContactsField,
        required: false,
      },
    ] as FieldConfig[],
  },
];

const subSection = [
  {
    id: "text",
    group: "subSection",
    title: "Редагування контенту міні-сенкцій",
    fields: [
      {
        name: "directContactTitle",
        type: "text",
        required: true,
        label: {
          uk: "Заголовок секції: Контактів",
          en: "Section title: contacts",
        },
      },
      {
        name: "responseTimeTitle",
        type: "text",
        required: true,
        label: {
          uk: "Заголовок секції: Час відповіді",
          en: "Section title: Response time",
        },
      },
      {
        name: "responseTimeDescription",
        type: "text",
        required: true,
        label: {
          uk: "Опис секції: Час відповіді",
          en: "Section description: Response time",
        },
      },
      {
        name: "socialMediaTitle",
        type: "text",
        required: true,
        label: {
          uk: "Заголовок секції: Соціальних мереж",
          en: "Section description: Social media",
        },
      },
    ] as FieldConfig[],
  },
];

const formSection = [
  {
    id: "text",
    group: "form",
    title: "Редагування контенту форми зворотнього зв'язку",
    fields: [
      {
        name: "form.title",
        type: "text",
        required: true,
        label: {
          uk: "Заголовок секції: Зворотнього зв'язку",
          en: "Section title: Feedback",
        },
      },
      {
        name: "form.modalTitle",
        type: "text",
        required: true,
        label: {
          uk: "Заголовок модального вікна: Зворотнього зв'язку",
          en: "Modal window title: Feedback",
        },
      },
      {
        name: "form.descriptionInputTitle",
        type: "text",
        required: true,
        label: {
          uk: "Назва поля для вводу тексту",
          en: "Text input field label",
        },
      },
      {
        name: "form.descriptionInputPlaceholder",
        type: "text",
        required: true,
        label: {
          uk: "Допоміжний текст поля для вводу тексту",
          en: "Placeholder for the text input field",
        },
      },
      {
        name: "form.radioButtonsTitle",
        type: "text",
        required: true,
        label: {
          uk: "Заголовок групи кнопок",
          en: "Title group button",
        },
      },
      {
        name: "form.radioButtons",
        type: "custom",
        component: FormRadioButton,
        required: false,
      },
      {
        name: "form.buttonSubmit",
        type: "text",
        required: true,
        label: {
          uk: "Кнопка відправки форми",
          en: "Button submit",
        },
      },
      {
        name: "form.privacyPolicyTitle",
        type: "text",
        required: true,
        label: {
          uk: "Текст політики конфіденційності",
          en: "Privacy Policy",
        },
      },
      {
        name: "form.privacyPolicyTextLink",
        type: "text",
        required: true,
        label: {
          uk: "Текст посилання політики конфіденційності",
          en: "Text link of the privacy policy",
        },
      },
    ] as FieldConfig[],
  },
];

export const feedbackFormBuilderConfig: FormBuilderConfig = {
  id: "feedback",
  sectionGroups: {
    contacts: {
      title: "Контакти",
      className: "flex flex-col gap-8",
    },
    form: {
      title: "Секція форми зворотнього зв'язку",
      className: "flex flex-col",
    },
    subSection: {
      title: "Міні-секції",
      className: "flex flex-col",
    },
  },
  options: {
    hasImage: false,
    submitText: "Зберегти зміни",
    resetText: "Скасувати правки",
  },
  sections: [...contacts, ...formSection, ...subSection],
};
