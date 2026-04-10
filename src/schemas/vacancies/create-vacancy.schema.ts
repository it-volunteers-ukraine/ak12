import { z } from "zod";
import { vacancyTypes } from "@/types/vacancy";

export const createVacancySchema = z.object({
  type: z.enum(vacancyTypes, `Vacancy type must be ${vacancyTypes.join(" or ")}`),

  salaryMin: z.number().int().positive(),
  salaryMax: z.number().int().positive().optional(),

  uk: z.object({
    position: z
      .string()
      .trim()
      .min(3, "Position must be at least 3 characters")
      .max(50, "Position must be no more than 50 characters"),

    description: z
      .string()
      .trim()
      .min(20, "Description be at least 20 characters")
      .max(255, "Position must be no more than 255 characters"),
  }),

  en: z.object({
    position: z
      .string()
      .trim()
      .min(3, "Position must be at least 3 characters")
      .max(50, "Position must be no more than 50 characters"),

    description: z
      .string()
      .trim()
      .min(20, "Description be at least 20 characters")
      .max(255, "Position must be no more than 255 characters"),
  }),
});

export type CreateVacancyDto = z.infer<typeof createVacancySchema>;
