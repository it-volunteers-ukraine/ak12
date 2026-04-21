import { SECTION_KEYS } from "@/constants";
import { heroContentSchema } from "@/schemas/heroContent";
import { mobilizationSchema } from "@/schemas/mobilizationSchema";
import { HeroSection, MobilizationSection } from "@/components/admin";

import { SectionDataMap, IAdminSectionConfig, TAdminFormComponent } from "./admin-types";

export type AdminSectionKey = keyof typeof ADMIN_CONFIG;

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
