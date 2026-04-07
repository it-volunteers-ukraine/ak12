"use server";

import { logger } from "@/lib/logger";
import { updateVacancySchema } from "@/schemas/update-vacancy.schema";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { VacancyMapped } from "@/types/vacancy";
import { ZodIssue } from "zod";

export async function updateVacancy(data: unknown): Promise<VacancyMapped[] | ZodIssue[]> {
  const result = updateVacancySchema.safeParse(data);

  if (!result.success) {
    logger.error(
      {
        errors: result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      "Update vacancy form validation failed",
    );

    return result.error.issues;
  }

  return vacancyService.update(result.data);
}
