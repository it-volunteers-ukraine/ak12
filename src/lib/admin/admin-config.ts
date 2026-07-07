import { SECTION_KEYS } from "@/constants";
import { aboutUsSchema } from "@/schemas/about-us.schema";
import {
  transferSchema,
  heroContentSchema,
  contract1824Schema,
  mobilizationSchema,
  feedbackContentSchema,
  headerAndFooterContentSchema,
  privacyPolicySchema,
} from "@/schemas";
import { AdminSectionKey, IAdminSectionConfig } from "@/lib/admin/admin-types";
import {
  HeroSection,
  FeedbackSection,
  TransferSection,
  AboutSectionAdmin,
  Contract1824Section,
  HeaderFooterSection,
  MobilizationSection,
  PrivacyPolicySection,
} from "@/components/admin";

export const ADMIN_CONFIG: { [K in AdminSectionKey]: IAdminSectionConfig<K> } = {
  about: {
    label: "Блок Про корпус",
    schema: aboutUsSchema,
    sectionKey: SECTION_KEYS.ABOUT,
    component: AboutSectionAdmin,
  },
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
  feedback: {
    label: "Зворотній зв'язок",
    schema: feedbackContentSchema,
    sectionKey: SECTION_KEYS.FEEDBACK,
    component: FeedbackSection,
  },
  "header-footer": {
    label: "Шапка та підвал сайту",
    schema: headerAndFooterContentSchema,
    sectionKey: SECTION_KEYS.HEADER,
    component: HeaderFooterSection,
  },
  "privacy-policy": {
    label: "Політика конфіденційності",
    schema: privacyPolicySchema,
    sectionKey: SECTION_KEYS.PRIVACY_POLICY,
    component: PrivacyPolicySection,
  },
};

export const getAdminSectionConfig = <K extends AdminSectionKey>(key: K): IAdminSectionConfig<K> => ADMIN_CONFIG[key];
