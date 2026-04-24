// 🎓 FORM BUILDER - рендерить форму яка працює з БД (uk/en структура)

"use client";

import { useFormContext } from "react-hook-form";
import { En, Uk } from "../../../../public/icons";
import { FormBuilderConfig, LOCALES } from "../types";
import { BtnGroup } from "@/components/admin/admin-form-elements";
import { FormImg, FormField } from "@/components/form-elements";

// Іконки для мов
const LANGUAGE_ICONS = {
  uk: Uk,
  en: En,
};

// 🎨 SECTION_LAYOUTS - grid layout для кожної секції
const SECTION_LAYOUTS: Record<string, string> = {
  "text-content": "grid-cols-1 lg:grid-cols-[350px_1fr_1fr]", // [Фото | UK | EN]
  "statistics": "grid-cols-1 lg:grid-cols-2",                 // [UK | EN]
  "subtitle": "grid-cols-1 lg:grid-cols-2",
  "button": "grid-cols-1 lg:grid-cols-2",
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
      
      {config.sections.map((section) => {
        const gridLayout = SECTION_LAYOUTS[section.id] || "grid-cols-1 lg:grid-cols-2";
        const showImage = section.id === "text-content" && config.options?.hasImage && onImageChange;
        
        return (
          <div key={section.id} className="mb-10">
            <div className={`grid ${gridLayout} gap-8`}>
              
              {showImage && (
                <div className={config.imageWrapperClassName}>
                  <FormImg
                    src={bannerImg}
                    file={imageFile}
                    label={config.options?.imageConfig?.label || "Фото на сайті"}
                    onRemove={onImageRemove || (() => {})}
                    onFileChange={onImageChange}
                  />
                </div>
              )}
              
              {LOCALES.map((locale) => {
                const Icon = LANGUAGE_ICONS[locale];
                const localeText = locale === "uk" ? "українською" : "англійською";
                const blockTitle = section.title 
                  ? `${section.title} ${localeText}` 
                  : `Текстовий контент ${localeText}`;
                
                return (
                  <div key={locale} className="rounded-xl border border-gray-200 p-6 bg-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-medium">{blockTitle}</h4>
                      <Icon width={42} height={32} />
                    </div>
                    
                    <div className="space-y-6">
                      {section.fields.map((field) => (
                        <div key={`${locale}-${field.name}`}>
                          {field.label && (
                            <label className="block mb-2 text-sm font-medium">
                              {field.label[locale]}
                            </label>
                          )}
                          <FormField
                            name={`${locale}.${field.name}`}
                            component={field.component}
                            className={field.className || "bg-white"}
                            {...field.props}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
            </div>
          </div>
        );
      })}
      
    </div>
  );
};