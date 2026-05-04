export type SectionKey = (typeof SECTION_KEYS)[keyof typeof SECTION_KEYS];

export const SECTION_KEYS = {
  HERO: "hero",
  ABOUT: "about",
  CONTACTS: "contacts",
  FEEDBACK: "feedback",
  TRANSFER: "transfer",
  HEADER: "header-footer",
  MOBILIZATION: "mobilization",
  CONTRACT_18_24: "contract-18-24",
} as const;
