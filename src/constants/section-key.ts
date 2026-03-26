export const SECTION_KEYS = {
  HEADER: "header",
  CONTACTS: "contacts",
} as const;

export type SectionKey = (typeof SECTION_KEYS)[keyof typeof SECTION_KEYS];
