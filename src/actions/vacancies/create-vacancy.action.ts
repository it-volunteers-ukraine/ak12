'use server';

import { ZodIssue } from "zod";

import { logger } from "@/lib/logger";
import { VacancyMapped } from "@/types/vacancy";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { createVacancySchema } from "@/schemas/vacancies/create-vacancy.schema";

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
