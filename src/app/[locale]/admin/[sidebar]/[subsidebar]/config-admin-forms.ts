import { ZodSchema } from "zod";

import { SectionKey, SECTION_KEYS } from "@/constants";
import { Contract1824Schema, contract1824Schema } from "@/schemas";
import { HeroSchema, heroContentSchema } from "@/schemas/heroContent";
import { MobilizationSchema, mobilizationSchema } from "@/schemas/mobilizationSchema";
import { HeroSection, Contract1824Section, MobilizationSection } from "@/components/admin";

export interface IAdminSectionConfig<K extends keyof SectionDataMap> {
  label: string;
  sectionKey: SectionKey;
  component: TAdminFormComponent<K>;
  schema: ZodSchema<SectionDataMap[K]>;
}
export type SectionDataMap = {
  hero: HeroSchema;
  mobilization: MobilizationSchema;
  "contract-18-24": Contract1824Schema;
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
  "contract-18-24": {
    label: "Контракт 18-24",
    schema: contract1824Schema,
    sectionKey: SECTION_KEYS.CONTRACT_18_24,
    component: Contract1824Section as TAdminFormComponent<"contract-18-24">,
  },
  mobilization: {
    label: "Мобілізація",
    schema: mobilizationSchema,
    sectionKey: SECTION_KEYS.MOBILIZATION,
    component: MobilizationSection as TAdminFormComponent<"mobilization">,
  },
} as const;

export const SERVER_SCHEMAS_MAP = Object.values(ADMIN_CONFIG).reduce(
  (acc, item) => ({
    ...acc,
    [item.sectionKey as SectionKey]: item.schema,
  }),
  {} as Record<SectionKey, ZodSchema>,
);
