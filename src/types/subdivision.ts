import { Locale } from "@/types/locale";
import { StoredImage } from "@/lib/admin/upload-image.service";

export interface Subdivision {
  id: string;
  name: string;
  slug: string;
  description: string;
  siteUrl: string | null;
  imageUrl: StoredImage | null;
  hoverImageUrl: StoredImage | null;
  hoverName: string | null;
  hoverDescription: string | null;
  isActive: boolean;
  sortOrder: number;
  updatedAt?: string;
  languageCode: Locale;
  languageId: string;
}
