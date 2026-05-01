export type SectionKey = (typeof SECTION_KEYS)[keyof typeof SECTION_KEYS];

export const SECTION_KEYS = {
  HERO: "hero",
  HEADER: "header",
  CONTACTS: "contacts",
  FEEDBACK: "feedback",
  TRANSFER: "transfer",
  MOBILIZATION: "mobilization",
  LIFE_OF_UNIT: "life_of_unit",
  CONTRACT_18_24: "contract-18-24",
} as const;
