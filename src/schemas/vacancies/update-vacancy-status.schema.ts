import { z } from "zod";

export const updateVacancyStatusSchema = z.object({
  ukId: z.uuid(),
  enId: z.uuid(),
  isActive: z.boolean(),
});

export type UpdateVacancyStatusDto = z.infer<typeof updateVacancyStatusSchema>;
