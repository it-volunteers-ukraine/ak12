import { z } from "zod";

export const deleteVacancySchema = z.object({
  ukId: z.uuid(),
  enId: z.uuid(),
});

export type DeleteVacancyDto = z.infer<typeof deleteVacancySchema>;
