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
  locales?: Locale[];
  required?: boolean;
  placeholder?: Record<Locale, string>;
  component?: ComponentType<any>;
  props?: Record<string, any>;
  
  className?: string;
}

export interface SectionConfig {
  id: string;
  title?: string;
  titlePlacement?: "inside" | "outside";
  localeLayout?: "split" | "combined" | "by-field-2col" | "by-locale-2col";
  group?: string;
  fields: FieldConfig[];
}

export interface FormBuilderConfig {
  id: string;
  sections: SectionConfig[];
  sectionGroups?: Record<
    string,
    | string
    | {
        className?: string;
        title?: string;
        titleClassName?: string;
      }
  >;
  
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
