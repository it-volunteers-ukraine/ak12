import { z } from "zod";

export const storedImageSchema = z.object({
  publicId: z.string(),
  secureUrl: z.string().url(),
}).nullable();

export const subdivisionContentSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Назва обов'язкова"),
  slug: z.string().min(1, "Slug обов'язковий"), 
  description: z.string().min(1, "Опис обов'язковий"),
  hoverName: z.string().nullable(),
  hoverDescription: z.string().nullable(),
  siteUrl: z.string().url("Невірний формат URL").nullable().or(z.literal("").transform(() => null)),
  imageUrl: storedImageSchema,
  hoverImageUrl: storedImageSchema,
  // sortOrder може бути string з форми або number з БД
  sortOrder: z.union([z.number(), z.string()]).transform(val => 
    typeof val === 'string' ? parseInt(val, 10) : val
  ).pipe(z.number().int().nonnegative()),
  isActive: z.boolean().default(true),
  languageId: z.string().uuid().optional(),
  updatedAt: z.string().optional(), 

});

export const adminSchema = z.object({
  uk: subdivisionContentSchema,
  en: subdivisionContentSchema,
});

export type SubdivisionContent = z.infer<typeof subdivisionContentSchema>;
export type AdminData = z.infer<typeof adminSchema>;

export interface ISubdivisionSection {
  data?: AdminData;
  onSuccess?: () => void;
}