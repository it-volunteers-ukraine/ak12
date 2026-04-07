export type SectionKey = (typeof SECTION_KEYS)[keyof typeof SECTION_KEYS];

export const SECTION_KEYS = {
  HERO: "hero",
  HEADER: "header",
  CONTACTS: "contacts",
  MOBILIZATION: "mobilization",
  LIFE_OF_UNIT: "life_of_unit",
} as const;
