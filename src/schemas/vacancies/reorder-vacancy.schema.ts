import { z } from "zod";

export const reorderVacanciesSchema = z.object({
  items: z.array(
    z.object({
      ukId: z.uuid(),
      enId: z.uuid(),
      sortOrder: z.number().int().min(0),
    })
  ).min(1),
});

export type ReorderVacanciesDto = z.infer<typeof reorderVacanciesSchema>;