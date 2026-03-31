"use server";

import { logger } from "@/lib/logger";
import { createVacancySchema } from "@/schemas/create-vacancy.schema";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { VacancyMapped } from "@/types/vacancy";
import { ZodIssue } from "zod";

export async function createVacancy(data: unknown): Promise<VacancyMapped[] | ZodIssue[]> {
  const result = createVacancySchema.safeParse(data);

  if (!result.success) {
    logger.error(
      {
        errors: result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      "Create vacancy form validation failed",
    );

    return result.error.issues;
  }

  return vacancyService.create(result.data);
}
