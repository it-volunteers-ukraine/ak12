import { ZodSchema } from "zod";

import { SectionKey, SECTION_KEYS } from "@/constants";
import { HeroSchema, heroContentSchema } from "@/schemas/heroContent";
import { HeroSection, MobilizationSection } from "@/components/admin";
import { MobilizationSchema, mobilizationSchema } from "@/schemas/mobilizationSchema";

export interface IAdminSectionConfig<K extends keyof SectionDataMap> {
  label: string;
  sectionKey: SectionKey;
  component: TAdminFormComponent<K>;
  schema: ZodSchema<SectionDataMap[K]>;
}
export type SectionDataMap = {
  hero: HeroSchema;
  mobilization: MobilizationSchema;
};
export type AdminSectionKey = keyof typeof ADMIN_CONFIG;
export interface IAdminFormProps<K extends keyof SectionDataMap> {
  data: {
    en: SectionDataMap[K];
    uk: SectionDataMap[K];
  };
}
export type TAdminFormComponent<K extends keyof SectionDataMap> = React.ComponentType<IAdminFormProps<K>>;

export const ADMIN_CONFIG: { [K in keyof SectionDataMap]: IAdminSectionConfig<K> } = {
  hero: {
    label: "Головний екран",
    schema: heroContentSchema,
    sectionKey: SECTION_KEYS.HERO,
    component: HeroSection as TAdminFormComponent<"hero">,
  },
  mobilization: {
    label: "Мобілізація",
    schema: mobilizationSchema,
    sectionKey: SECTION_KEYS.MOBILIZATION,
    component: MobilizationSection as TAdminFormComponent<"mobilization">,
  },
} as const;

export const ADMIN_SECTIONS_CONFIG = Object.fromEntries(
  Object.entries(ADMIN_CONFIG).map(([key, { schema, sectionKey }]) => [
    key,
    { schema, sectionKey: sectionKey as SectionKey },
  ]),
) as Record<AdminSectionKey, { schema: ZodSchema; sectionKey: SectionKey }>;

export const FORM_COMPONENTS = Object.fromEntries(
  Object.entries(ADMIN_CONFIG).map(([key, { component }]) => [key, component]),
) as { [K in AdminSectionKey]: TAdminFormComponent<K> };

export const SERVER_SCHEMAS_MAP = Object.values(ADMIN_CONFIG).reduce(
  (acc, item) => ({
    ...acc,
    [item.sectionKey as SectionKey]: item.schema,
  }),
  {} as Record<SectionKey, ZodSchema>,
);
