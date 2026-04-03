"use server";

import { logger } from "@/lib/logger";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { deleteVacancySchema } from "@/schemas/delete-vacancy.schema";
import { ZodIssue } from "zod";

export async function deleteVacancy(data: unknown): Promise<void | ZodIssue[]> {
  const result = deleteVacancySchema.safeParse(data);

  if (!result.success) {
    logger.error(
      {
        errors: result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      "Delete vacancy data validation failed",
    );

    return result.error.issues;
  }

  await vacancyService.delete(result.data);
}
