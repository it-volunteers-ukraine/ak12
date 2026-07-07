"use server";

import { ZodIssue } from "zod";
import { reorderVacanciesSchema } from "@/schemas/vacancies/reorder-vacancy.schema";
import { logger } from "@/lib/logger/logger";
import { vacancyService } from "@/lib/vacancies/vacancy.service";

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
