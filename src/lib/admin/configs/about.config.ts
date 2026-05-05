import { AdminDataMap } from "@/lib/admin/admin-types";
import { FormBuilderConfig } from "@/lib/form-builder";
import { SectionConfig } from "@/lib/form-builder/types";

type AboutData = AdminDataMap["about"];

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
      },
      {
        name: "content.title",
        type: "text",
        required: true,
        label: {
          uk: "Заголовок блоку українською",
          en: "Block title in English",
        },
      },
    ],
  },
];

export const createAboutFormBuilderConfig = (data: AboutData): FormBuilderConfig => ({
  id: "about",
  options: {
    submitText: "Зберегти зміни",
    resetText: "Скасувати правки",
  },
  sections: [
    ...baseSections,
    ...(data.uk?.content?.gallery ?? []).map<SectionConfig>((item, index) => ({
      id: `gallery_item_${index}`,
      title: `Елемент галереї #${index + 1}`,
      localeLayout: "split",
      fields: [
        {
          name: `content.gallery.${index}.text`,
          type: "text",
          required: true,
          label: {
            uk: "Підпис українською",
            en: "Caption in English",
          },
        },
      ],
    })),
  ],
});
