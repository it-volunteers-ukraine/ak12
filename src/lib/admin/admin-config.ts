import { SECTION_KEYS } from "@/constants";
import { heroContentSchema } from "@/schemas/heroContent";
import { mobilizationSchema } from "@/schemas/mobilizationSchema";
import { HeroSection, MobilizationSection } from "@/components/admin";

import { AdminSectionKey, IAdminSectionConfig } from "./admin-types";

export const ADMIN_CONFIG: { [K in AdminSectionKey]: IAdminSectionConfig<K> } = {
  hero: {
    label: "Головний екран",
    schema: heroContentSchema,
    sectionKey: SECTION_KEYS.HERO,
    component: HeroSection,
  },
  mobilization: {
    label: "Мобілізація",
    schema: mobilizationSchema,
    sectionKey: SECTION_KEYS.MOBILIZATION,
    component: MobilizationSection,
  },
};

export const getAdminSectionConfig = <K extends AdminSectionKey>(key: K): IAdminSectionConfig<K> => ADMIN_CONFIG[key];
