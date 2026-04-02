import { SECTION_KEYS } from "@/constants";
import { HeroSection } from "@/components/admin/hero-section";
import { TestSection } from "@/components/admin/test-section";
import { HeroSchema, heroContentSchema } from "@/schemas/heroContent";
import { TestSchema, mobilizationSchema } from "@/schemas/testContent";

export type SectionDataMap = {
  hero: HeroSchema;
  mobilization: TestSchema;
};
export interface IAdminFormProps<K extends keyof SectionDataMap> {
  data: {
    en: SectionDataMap[K];
    uk: SectionDataMap[K];
  };
}
export type TAdminFormComponent<K extends keyof SectionDataMap> = React.ComponentType<IAdminFormProps<K>>;
export type AdminSectionKey = keyof typeof ADMIN_SECTIONS_CONFIG;

export const FORM_COMPONENTS: { [K in keyof SectionDataMap]: TAdminFormComponent<K> } = {
  hero: HeroSection as TAdminFormComponent<"hero">,
  mobilization: TestSection as TAdminFormComponent<"mobilization">,
};

export const ADMIN_SECTIONS_CONFIG = {
  hero: {
    schema: heroContentSchema,
    sectionKey: SECTION_KEYS.HERO,
  },
  mobilization: {
    schema: mobilizationSchema,
    sectionKey: SECTION_KEYS.MOBILIZATION,
  },
} as const;
