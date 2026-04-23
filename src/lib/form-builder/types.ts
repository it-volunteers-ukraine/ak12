// 🎓 TYPES - типи для Form Builder який працює з БД

import { ComponentType } from "react";

export type Locale = "uk" | "en";

export const LOCALES: Locale[] = ["uk", "en"];

export type FieldType = 
  | "text"
  | "textarea"
  | "number";

export interface FieldConfig {
  name: string;
  label: Record<Locale, string>;
  type: FieldType;
  required?: boolean;
  placeholder?: Record<Locale, string>;
  component?: ComponentType<any>;
  props?: Record<string, any>;
  
  // 🎨 Стилізація поля
  className?: string;              // Для самого інпута/textarea
  wrapperClassName?: string;       // Для контейнера uk/en пари
  labelClassName?: string;         // Для лейбла поля
  labelWrapperClassName?: string;  // Для контейнера лейбл+іконка
  iconClassName?: string;          // Для іконки мови (En/Uk)
  iconWrapperClassName?: string;   // Для обгортки іконки
}

export interface SectionConfig {
  id: string;
  title?: string;
  description?: string;
  
  // 🎨 Лейаут секції
  layout?: "row" | "col" | "grid-2" | "grid-3";
  
  // 🎨 Стилізація секції
  className?: string;              // Кастомні класи (додаються до base)
  sectionWrapperClassName?: string; // Повний override base класів секції
  fieldsContainerClassName?: string; // Контейнер полів (де layout)
  titleClassName?: string;         // Стилі заголовка
  descriptionClassName?: string;   // Стилі опису
  
  fields: FieldConfig[];
}

export interface FormBuilderConfig {
  id: string;
  sections: SectionConfig[];
  
  // 🎨 Стилізація всієї форми
  className?: string;              // Обгортка форми
  buttonsClassName?: string;       // Обгортка кнопок (BtnGroup)
  submitClassName?: string;        // Кнопка Submit
  resetClassName?: string;         // Кнопка Reset
  imageWrapperClassName?: string;  // Обгортка зображення
  
  options?: {
    hasImage?: boolean;
    imageConfig?: {
      label: string;
      maxSize?: number;
      accept?: string[];
    };
    
    submitText?: string;
    resetText?: string;
  };
}

// ============================================
// 6. СТАРІ ТИПИ (для сумісності з SimpleForm)
// ============================================

export interface SimpleFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
}

export interface SimpleFormConfig {
  id: string;
  fields: SimpleFieldConfig[];
  submitText?: string;
  resetText?: string;
}

// 🤓 Пояснення:
// 
// Конфіг описує форму БЕЗ uk/en префіксів
// Form Builder автоматично створить uk і en версії
//
// Приклад:
// {
//   name: "title",
//   label: { uk: "Заголовок", en: "Title" }
// }
//
// Рендериться як:
// <FieldWithIcon locale="uk" basePath="title" label="Заголовок" />
// <FieldWithIcon locale="en" basePath="title" label="Title" />
//
// Створює поля: "uk.title" і "en.title"
