import { SECTION_KEYS } from "@/constants";
import { transferSchema, heroContentSchema, contract1824Schema, mobilizationSchema } from "@/schemas";
import { HeroSection, TransferSection, Contract1824Section, MobilizationSection } from "@/components/admin";

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

  transfer: {
    label: "Трансфер",
    schema: transferSchema,
    sectionKey: SECTION_KEYS.TRANSFER,
    component: TransferSection,
  },
};

export const getAdminSectionConfig = <K extends AdminSectionKey>(key: K): IAdminSectionConfig<K> => ADMIN_CONFIG[key];
