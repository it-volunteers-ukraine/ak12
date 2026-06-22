"use server";

import { ZodIssue } from "zod";
import { VacancyMapped } from "@/types/vacancy";
import { updateVacancySchema } from "@/schemas/vacancies/update-vacancy.schema";
import { logger } from "@/lib/logger/logger";
import { vacancyService } from "@/lib/vacancies/vacancy.service";

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
