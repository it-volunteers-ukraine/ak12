import { ComponentType } from "react";

export type Locale = "uk" | "en";
export type FieldType = "text" | "textarea" | "number" | "image" | "custom" | "video";
interface FieldConfigBase {
  id?: string;
  type: FieldType;
  className?: string;
  locales?: Locale[];
  required?: boolean;
  props?: Record<string, any>;
  component?: ComponentType<any>;
  label?: Record<Locale, string>;
  placeholder?: Record<Locale, string>;
}

interface ImageFieldConfig extends Omit<FieldConfigBase, "type"> {
  type: "image";
  name?: string;
}

interface VideoFieldConfig extends Omit<FieldConfigBase, "type"> {
  type: "video";
  name?: string;
}

interface NonImageFieldConfig extends Omit<FieldConfigBase, "type"> {
  name: string;
  type: Exclude<FieldType, "image">;
}

export type FieldConfig = ImageFieldConfig | VideoFieldConfig | NonImageFieldConfig;

export interface SectionConfig {
  id: string;
  group?: string;
  title?: string;
  fields: FieldConfig[];
  hideLocaleBadge?: boolean;
  titlePlacement?: "inside" | "outside";
  localeTitles?: Partial<Record<Locale, string>>;
  localeLayout?: "split" | "combined" | "by-field-2col" | "by-locale-2col" | "gallery-3col";
}
export interface FormBuilderConfig {
  id: string;
  className?: string;
  resetClassName?: string;
  submitClassName?: string;
  buttonsClassName?: string;
  sections: SectionConfig[];
  imageWrapperClassName?: string;
  sectionGroups?: Record<
    string,
    | string
    | {
        title?: string;
        className?: string;
        titleClassName?: string;
      }
  >;
  options?: {
    hasImage?: boolean;
    resetText?: string;
    submitText?: string;
    imageConfig?: {
      label: string;
      maxSize?: number;
      accept?: string[];
    };
  };
}
export const LOCALES: Locale[] = ["uk", "en"];
