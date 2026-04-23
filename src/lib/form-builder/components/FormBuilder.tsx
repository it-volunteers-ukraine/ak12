// 🎓 FORM BUILDER - рендерить форму яка працює з БД (uk/en структура)

"use client";

import { useFormContext } from "react-hook-form";
import { En, Uk } from "../../../../public/icons";
import { FormBuilderConfig, LOCALES, SectionConfig } from "../types";
import { BtnGroup, FieldWithIcon } from "@/components/admin/admin-form-elements";
import { FormImg } from "@/components/form-elements";

// Іконки для мов
const LANGUAGE_ICONS = {
  uk: Uk,
  en: En,
};

interface FormBuilderProps {
  config: FormBuilderConfig;
  data: any;
  
  imageFile?: File | null;
  onImageChange?: (file: File | null) => void;
  onImageRemove?: () => void;
}

export const FormBuilder = ({
  config,
  data,
  imageFile,
  onImageChange,
  onImageRemove,
}: FormBuilderProps) => {
  const { reset, formState } = useFormContext();
  const { isValid } = formState;
  
  // Тексти кнопок
  const submitText = config.options?.submitText || "Зберегти зміни";
  const resetText = config.options?.resetText || "Скасувати правки";
  const bannerImage = data.uk?.backgroundImage || data.en?.backgroundImage || null;
  const bannerImg = bannerImage?.secureUrl || null;
  
  return (
    <div className={config.className || "form-builder"}>
      <div className={config.buttonsClassName}>
        <BtnGroup
          isValid={isValid}
          onReset={() => reset(data)}
          submitText={submitText}
          resetText={resetText}
          submitClassName={config.submitClassName}
          resetClassName={config.resetClassName}
        />
      </div>
      
      {config.options?.hasImage && onImageChange && (
        <div className={config.imageWrapperClassName || "mb-10"}>
          <FormImg
            src={bannerImg}
            file={imageFile}
            label={config.options.imageConfig?.label || "Фото на сайті"}
            onRemove={onImageRemove || (() => {})}
            onFileChange={onImageChange}
          />
        </div>
      )}
      
      {config.sections.map((section) => (
        <div key={section.id} className="mb-10">
          
          {section.title && (
            <h3 className={section.titleClassName || "mb-4 text-xl font-medium"}>
              {section.title}
            </h3>
          )}
          
          {section.description && (
            <p className={section.descriptionClassName || "mb-4 text-sm text-gray-600"}>
              {section.description}
            </p>
          )}

          <div className={getSectionClassName(section)}>
            
            {section.fields.map((field) => (
              <div key={field.name} className={field.wrapperClassName || "flex gap-12"}>
                
                {LOCALES.map((locale) => {
                  const Icon = LANGUAGE_ICONS[locale];
                  
                  return (
                    <FieldWithIcon
                      key={`${locale}-${field.name}`}
                      icon={Icon}
                      locale={locale}
                      basePath={field.name}
                      label={field.label[locale]}
                      labelClassName={field.labelClassName}
                      labelWrapperClassName={field.labelWrapperClassName}
                      iconWidth={42}
                      iconHeight={32}
                      iconClassName={field.iconClassName}
                      iconWrapperClassName={field.iconWrapperClassName}
                      component={field.component}
                      className={field.className}
                      {...field.props}
                    />
                  );
                })}
                
              </div>
            ))}
            
          </div>
        </div>
      ))}
      
    </div>
  );
};

function getSectionClassName(section: SectionConfig) {
  // Якщо є sectionWrapperClassName - використовуємо тільки його
  if (section.sectionWrapperClassName) {
    return section.sectionWrapperClassName;
  }
  
  // Інакше - base + layout + custom className
  const base = "rounded-2xl border border-gray-300 bg-[#F8F9FA]/80 px-6 pt-10 pb-4";
  
  const layoutMap: Record<string, string> = {
    row: "flex gap-12",
    col: "flex flex-col gap-6",
    "grid-2": "grid grid-cols-2 gap-12",
    "grid-3": "grid grid-cols-3 gap-12",
  };
  
  const layout = layoutMap[section.layout || "col"];
  
  return `${base} ${layout} ${section.className || ""}`.trim();
}