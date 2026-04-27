import { SECTION_KEYS } from "@/constants";
import { contract1824Schema } from "@/schemas";
import { heroContentSchema } from "@/schemas/heroContent";
import { mobilizationSchema } from "@/schemas/mobilizationSchema";
import { HeroSection, Contract1824Section, MobilizationSection } from "@/components/admin";

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
  "contract-18-24": {
    label: "Контракт 18-24",
    schema: contract1824Schema,
    sectionKey: SECTION_KEYS.CONTRACT_18_24,
    component: Contract1824Section,
  },
};

export const getAdminSectionConfig = <K extends AdminSectionKey>(key: K): IAdminSectionConfig<K> => ADMIN_CONFIG[key];
