import z, { ZodObject, ZodSchema, ZodRawShape } from "zod";

import { SectionKey } from "@/constants";
import { HeroSchema, heroContentSchema } from "@/schemas/heroContent";
import { mobilizationSchema, MobilizationSchema } from "@/schemas/mobilizationSchema";

import { ADMIN_SCHEMAS } from "./admin-schemas";

export type SectionDataMap = {
  hero: HeroSchema;
  mobilization: MobilizationSchema;
};
export interface IAdminSectionConfig<K extends keyof SectionDataMap> {
  label: string;
  sectionKey: SectionKey;
  component: TAdminFormComponent<K>;
  schema: ZodSchema<SectionDataMap[K]>;
}
export interface IAdminFormProps<K extends keyof SectionDataMap> {
  data: {
    en: SectionDataMap[K];
    uk: SectionDataMap[K];
  };
}
export type TAdminFormComponent<K extends keyof SectionDataMap> = React.ComponentType<IAdminFormProps<K>>;
type MultiLang<S extends ZodRawShape, D> = {
  data: {
    en: D;
    uk: D;
  };
  schema: ZodObject<{
    en: ZodObject<S>;
    uk: ZodObject<S>;
  }>;
};
export type AllAdminForms =
  | ({ type: "hero" } & MultiLang<typeof heroContentSchema.shape, HeroSchema>)
  | ({ type: "mobilization" } & MultiLang<typeof mobilizationSchema.shape, MobilizationSchema>);
export type AdminDataMap = {
  [K in keyof typeof ADMIN_SCHEMAS]: z.infer<(typeof ADMIN_SCHEMAS)[K]>;
};
