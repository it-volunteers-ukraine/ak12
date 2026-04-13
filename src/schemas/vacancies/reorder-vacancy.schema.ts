import { z } from "zod";

export const reorderVacanciesSchema = z.object({
  items: z
    .array(
      z.object({
        ukId: z.uuid(),
        enId: z.uuid(),
        sortOrder: z.number().int().min(0),
      }),
    )
    .min(1)
    .refine((items) => new Set(items.map((i) => i.sortOrder)).size === items.length, {
      message: "sortOrder values must be unique within the batch",
    }),
});

export type ReorderVacanciesDto = z.infer<typeof reorderVacanciesSchema>;
