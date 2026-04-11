"use server";

import { logger } from "@/lib/logger";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { updateVacancyStatusSchema } from "@/schemas/vacancies/update-vacancy-status.schema";
import { ZodIssue } from "zod";

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
