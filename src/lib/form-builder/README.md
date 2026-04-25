# FormBuilder Guide

## 🏗️ Архітектура

FormBuilder складається з 2 основних компонентів:

1. **FormBuilder** - головний компонент, обробляє секції, групи, зображення та кнопки
2. **LocaleSection** - рендерить поля форми в залежності від `localeLayout` режиму

Кожен режим `localeLayout` має свій окремий компонент:
- `SplitLayout` - 2 окремі картки UK | EN
- `CombinedLayout` - 1 картка, поля по черзі uk → en
- `ByFieldLayout` - 1 картка, кожне поле uk | en
- `ByLocaleLayout` - 1 картка, ліворуч всі uk, праворуч всі en

## 1) Базова ідея

`FormBuilder` один для всіх адмін-форм.  
Ми керуємо виглядом через `config`.

- `sections[]` - список секцій форми
- `fields[]` - поля всередині секції
- `localeLayout` - як показувати `uk/en`
- `titlePlacement` - де показувати title секції
- `group` + `sectionGroups` - як об'єднувати кілька секцій в один ряд/групу

Типи: [types.ts](./types.ts)

## 2) Section Config

```ts
type SectionConfig = {
  id: string;
  title?: string;
  titlePlacement?: "inside" | "outside";
  localeLayout?: "split" | "combined" | "by-field-2col" | "by-locale-2col";
  group?: string;
  fields: FieldConfig[];
};
```

### `localeLayout`

- `split` (default): 2 окремі картки `UK` і `EN`.
- `combined`: 1 картка; поля йдуть по черзі (для кожного поля спочатку `uk`, потім `en`).
- `by-field-2col`: 1 картка; для кожного поля рядок `uk | en`.
- `by-locale-2col`: 1 картка; ліва колонка всі поля `uk`, права колонка всі поля `en`.

### `titlePlacement`

- `inside` (default): title всередині картки.
- `outside`: title над секцією.
  - у `split`-режимі прапори біля label поля (а не в шапці картки).

## 3) Field Config

```ts
type FieldConfig = {
  name: string; // напр. "title" або "support.value"
  label: { uk: string; en: string };
  type: "text" | "textarea" | "number";
  locales?: ("uk" | "en")[]; // напр. ["uk"]
};
```

### `locales`

- якщо не вказано: поле рендериться для обох мов
- `locales: ["uk"]`: поле показується тільки в `uk`

Це зручно для значень, які однакові в `uk/en` (а в `onSubmit` ти копіюєш `uk -> en`).

## 4) Групи секцій (`sectionGroups`)

У `FormBuilderConfig` можна задати групу як рядок або як об'єкт:

```ts
sectionGroups: {
  "hero-stats": {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
    title: "Статистичні дані",
    titleClassName: "text-lg font-medium",
  },
}
```

Щоб секція потрапила в групу:

```ts
{ id: "statistics_support", group: "hero-stats", ... }
```

## 5) Приклад (практичний)

```ts
export const heroFormBuilderConfig: FormBuilderConfig = {
  id: "hero",
  sectionGroups: {
    "hero-stats": {
      className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
      title: "Статистичні дані",
    },
  },
  sections: [
    {
      id: "text-content",
      title: "Текстовий контент",
      localeLayout: "split", // Фото | UK | EN
      fields: [
        { name: "title", type: "textarea", label: { uk: "...", en: "..." } },
        { name: "subtitle", type: "textarea", label: { uk: "...", en: "..." } },
      ],
    },
    {
      id: "button",
      title: "Редагування кнопки",
      titlePlacement: "outside",
      fields: [{ name: "buttonTitle", type: "text", label: { uk: "...", en: "..." } }],
    },
    {
      id: "statistics_support",
      localeLayout: "combined",
      group: "hero-stats",
      fields: [
        { name: "support.title", type: "text", label: { uk: "...", en: "..." } },
        { name: "support.value", type: "text", locales: ["uk"], label: { uk: "...", en: "..." } },
      ],
    },
  ],
};
```

## 6) Розширення функціоналу

### Додавання нового `localeLayout` режиму

1. Створи новий компонент в `LocaleSection.tsx`:
```tsx
const MyCustomLayout = ({ section, showOutsideTitle }: LocaleSectionProps) => {
  // твоя логіка рендерингу
  return <div>...</div>;
};
```

2. Додай його в `LAYOUT_COMPONENTS`:
```tsx
const LAYOUT_COMPONENTS = {
  split: SplitLayout,
  combined: CombinedLayout,
  "by-field-2col": ByFieldLayout,
  "by-locale-2col": ByLocaleLayout,
  "my-custom": MyCustomLayout, // ✅ новий режим
};
```

3. Використай в конфізі:
```tsx
{
  id: "my-section",
  localeLayout: "my-custom",
  fields: [...]
}
```

### Коли треба правити `FormBuilder.tsx`

Тільки якщо потрібні зміни в:
- Grid layouts для секцій (SECTION_LAYOUTS)
- Логіка групування секцій
- Обробка зображень
- Кнопки форми (submit/reset)

У більшості кейсів достатньо змін у конфізі або додавання нового layout в `LocaleSection.tsx`.


