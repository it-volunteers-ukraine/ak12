export type SectionKey = (typeof SECTION_KEYS)[keyof typeof SECTION_KEYS];

export const SECTION_KEYS = {
  HEADER: "header",
  CONTACTS: "contacts",
  HERO: "hero",
  MOBILIZATION: "mobilization",
} as const;
