"use server";

import { logger } from "@/lib/logger";
import { reorderVacanciesSchema } from "@/schemas/vacancies/reorder-vacancy.schema";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { ZodIssue } from "zod";

export async function reorderVacancies(data: unknown): Promise<void | ZodIssue[]> {
  const result = reorderVacanciesSchema.safeParse(data);

  if (!result.success) {
    logger.error(
      {
        errors: result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      "Reorder vacancies data validation failed",
    );

    return result.error.issues;
  }

  await vacancyService.reorder(result.data);
}
