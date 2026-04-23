'use server';

import { ZodIssue } from "zod";

import { logger } from "@/lib/logger";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { updateVacancyStatusSchema } from "@/schemas/vacancies/update-vacancy-status.schema";

export async function updateVacancyStatus(data: unknown): Promise<void | ZodIssue[]> {
  const result = updateVacancyStatusSchema.safeParse(data);

  if (!result.success) {
    logger.error(
      {
        errors: result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      "Update vacancy status data validation failed",
    );

    return result.error.issues;
  }

  await vacancyService.updateStatus(result.data);
}
