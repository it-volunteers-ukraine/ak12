import z from "zod";
import { createVacancySchema } from "./create-vacancy.schema";

export const updateVacancySchema = createVacancySchema.extend({
  ukId: z.uuid(),
  enId: z.uuid(),
  uk: createVacancySchema.shape.uk.extend({
    slug: z
      .string()
      .trim()
      .min(3, "Slug must be at least 3 characters")
      .max(100, "Slug must be no more than 100 characters"),
  }),
  en: createVacancySchema.shape.en.extend({
    slug: z
      .string()
      .trim()
      .min(3, "Slug must be at least 3 characters")
      .max(100, "Slug must be no more than 100 characters"),
  }),
});

export type UpdateVacancyDto = z.infer<typeof updateVacancySchema>;
