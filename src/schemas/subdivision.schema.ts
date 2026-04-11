import { z } from "zod";

export const subdivisionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Назва обов'язкова"),
  slug: z.string().nullable(),
  description: z.string().min(1, "Опис обов'язковий"),
  siteUrl: z.string().url("Невірний формат URL").nullable(),
  imageUrl: z.string().min(1, "Зображення герба обов'язкове"),
  hoverImageUrl: z.string().nullable(),
  hoverName: z.string().nullable(),
  hoverDescription: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
  languageCode: z.enum(["uk", "en"]),
  languageId: z.string().uuid(),
});

export type SubdivisionData = z.infer<typeof subdivisionSchema>;