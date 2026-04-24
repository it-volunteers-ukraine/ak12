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
  
  className?: string;
}

export interface SectionConfig {
  id: string;
  title?: string;
  fields: FieldConfig[];
}

export interface FormBuilderConfig {
  id: string;
  sections: SectionConfig[];
  
  // 🎨 Стилізація (опціонально)
  className?: string;
  buttonsClassName?: string;
  submitClassName?: string;
  resetClassName?: string;
  imageWrapperClassName?: string;
  
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