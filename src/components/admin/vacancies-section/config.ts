import { z } from "zod";
import { vacancyTypes, VacancyMapped } from "@/types/vacancy";

export const vacancyContentSchema = z.object({
  id: z.string().uuid().optional(),
  position: z.string().trim().min(3, "Мінімум 3 символи").max(50, "Максимум 50 символів"),
  slug: z.string().optional().default(""),
  description: z.string().trim().min(20, "Мінімум 20 символів").max(255, "Максимум 255 символів"),
  type: z.enum(vacancyTypes).optional(),
  salaryMin: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    .pipe(z.number().int().positive())
    .optional(),
  salaryMax: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    .pipe(z.number().int().positive())
    .optional()
    .nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().nonnegative().default(0),
  languageId: z.string().uuid().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
});

export const adminVacancySchema = z.object({
  uk: vacancyContentSchema,
  en: vacancyContentSchema,
});

export type VacancyContent = z.infer<typeof vacancyContentSchema>;
export type AdminVacancyData = z.infer<typeof adminVacancySchema>;

export interface IVacancySection {
  data?: { uk: VacancyMapped; en: VacancyMapped };
  onSuccess?: () => void;
  onBack?: () => void;
}