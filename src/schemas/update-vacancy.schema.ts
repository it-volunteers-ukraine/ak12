import z from "zod";
import { createVacancySchema } from "./create-vacancy.schema";

export const updateVacancySchema = createVacancySchema;

export type UpdateVacancyDto = z.infer<typeof updateVacancySchema>;