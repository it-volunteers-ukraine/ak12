import { Locale } from "./locale";

export interface Subdivision {
  id: string;
  name: string;
  slug: string | null;
  description: string;
  siteUrl: string | null;
  imageUrl: string;
  hoverImageUrl: string | null;
  hoverName: string | null;
  hoverDescription: string | null;
  isActive: boolean;
  sortOrder: number;
  languageCode: Locale;
  languageId: string;
}