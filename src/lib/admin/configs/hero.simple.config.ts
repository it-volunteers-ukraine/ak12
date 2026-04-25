// 🎓 HERO CONFIG - опис Hero форми через конфіг

import { SimpleFormConfig } from "@/lib/form-builder";

export const heroSimpleConfig: SimpleFormConfig = {
  id: "hero-simple",
  
  submitText: "Зберегти зміни",
  resetText: "Скасувати правки",

  fields: [
    {
      name: "title",
      label: "Заголовок",
      type: "text",
      required: true,
      placeholder: "Введіть заголовок..."
    },
    
    {
      name: "description",
      label: "Опис",
      type: "textarea",
      placeholder: "Введіть опис секції..."
    },
    
    {
      name: "buttonTitle",
      label: "Текст кнопки",
      type: "text",
      required: true,
      placeholder: "Напр: Дізнатись більше"
    },
    
    {
      name: "supportValue",
      label: "Підтримка (число)",
      type: "number",
      placeholder: "0"
    }
  ]
};

