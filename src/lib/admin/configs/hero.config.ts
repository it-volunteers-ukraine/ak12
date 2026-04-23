// 🎓 HERO CONFIG - конфіг для Hero форми (працює з БД)

import { FormBuilderConfig } from "@/lib/form-builder";

export const heroFormBuilderConfig: FormBuilderConfig = {
  id: "hero",
  
  // ============================================
  // 🎨 1. СТИЛІ ВСІЄЇ ФОРМИ (необов'язково)
  // ============================================
  // className: "max-w-6xl mx-auto p-8",
  // buttonsClassName: "sticky top-0 z-10",
  // submitClassName: "bg-green-600",
  // resetClassName: "border-red-500",
  // imageWrapperClassName: "mb-12",
  
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
      layout: "row",
      
      // ============================================
      // 🎨 2. СТИЛІ СЕКЦІЇ (необов'язково)
      // ============================================
      // title: "Головний текст",
      // description: "Опис секції",
      // className: "shadow-lg border-l-4 border-blue-500",
      // titleClassName: "text-2xl font-bold",
      // descriptionClassName: "text-gray-500",
      // sectionWrapperClassName: "p-8 bg-white",  // ❗ Повний override
      // fieldsContainerClassName: "gap-16",
      
      fields: [
        {
          name: "title",
          type: "textarea",
          required: true,
          
          // ============================================
          // 🎨 3. СТИЛІ ПОЛЯ (необов'язково)
          // ============================================
          className: "h-24",  // ← Для textarea
          // wrapperClassName: "flex gap-4",  // ← Обгортка uk/en
          // labelClassName: "text-lg font-bold",
           labelWrapperClassName: "flex h-24 gap-4 items-center",  // ← Контейнер лейбл+іконка ✅
          // iconClassName: "w-12 h-10",
          // iconWrapperClassName: "p-3 bg-blue-100 rounded-full",
          
          label: {
            uk: "Текстовий контент українською",
            en: "Text content in English",
          },
          props: {
            rows: 3,
          },
        },
      ],
    },
    
    {
      id: "statistics",
      title: "Статистичні дані",
      layout: "col",
      
      // 🎨 Приклад: можна додати стилі секції тут
      // className: "bg-gradient-to-r from-purple-100 to-pink-100",
      // titleClassName: "text-3xl font-black text-purple-900",
      
      fields: [
        {
          name: "support.title",
          type: "text",
          required: true,
          
          // 🎨 Приклад: стилі для конкретного поля
          // className: "border-b-4 border-green-400 text-lg",
          // labelClassName: "font-bold text-green-800",
          
          label: {
            uk: "Підтримка - Заголовок",
            en: "Support - Title",
          },
        },
        {
          name: "support.value",
          type: "text",
          required: true,
          label: {
            uk: "Підтримка - Значення",
            en: "Support - Value",
          },
        },
        
        {
          name: "majors.title",
          type: "text",
          required: true,
          label: {
            uk: "Майори - Заголовок",
            en: "Majors - Title",
          },
        },
        {
          name: "majors.value",
          type: "text",
          required: true,
          label: {
            uk: "Майори - Значення",
            en: "Majors - Value",
          },
        },
        {
          name: "hiringChance.title",
          type: "text",
          required: true,
          label: {
            uk: "Шанс найму - Заголовок",
            en: "Hiring Chance - Title",
          },
        },
        {
          name: "hiringChance.value",
          type: "text",
          required: true,
          label: {
            uk: "Шанс найму - Значення",
            en: "Hiring Chance - Value",
          },
        },
      ],
    },
    {
      id: "subtitle",
      layout: "row",
      fields: [
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
      layout: "row",
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
  ],
};

// ============================================
// 📚 ДОВІДКА: Всі доступні className для кастомізації
// ============================================
//
// 🎯 НА РІВНІ ФОРМИ (FormBuilderConfig):
//   • className - обгортка всієї форми
//   • buttonsClassName - обгортка кнопок Submit/Reset
//   • submitClassName - кнопка Submit
//   • resetClassName - кнопка Reset
//   • imageWrapperClassName - обгортка зображення
//
// 🎯 НА РІВНІ СЕКЦІЇ (SectionConfig):
//   • className - додаткові класи (додаються до base)
//   • sectionWrapperClassName - ПОВНА заміна base класів
//   • fieldsContainerClassName - контейнер полів (де layout)
//   • titleClassName - заголовок секції
//   • descriptionClassName - опис секції
//
// 🎯 НА РІВНІ ПОЛЯ (FieldConfig):
//   • className - САМ інпут/textarea ✅
//   • wrapperClassName - обгортка uk/en пари
//   • labelClassName - лейбл поля
//   • labelWrapperClassName - контейнер лейбл+іконка ✅ НОВИЙ
//   • iconClassName - іконка мови (En/Uk)
//   • iconWrapperClassName - обгортка іконки
//
// 💡 Приклад:
//   {
//     name: "title",
//     className: "h-24 bg-yellow-50",           // textarea
//     wrapperClassName: "flex gap-4",           // uk/en wrapper
//     labelClassName: "font-bold",              // label
//     labelWrapperClassName: "flex gap-4",      // label+icon container ✅
//   }

