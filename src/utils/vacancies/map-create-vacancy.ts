import { slugify } from "transliteration";
import { ActiveLanguage } from "@/types/enum";
import { CreateVacancyDto } from "@/schemas/vacancies/create-vacancy.schema";
import { logger } from "@/lib/logger/logger";

export function mapCreateVacancy(data: CreateVacancyDto, langMap: Record<ActiveLanguage, string>) {
  const ukLanguageId = langMap.uk;
  const enLanguageId = langMap.en;

  if (!ukLanguageId || !enLanguageId) {
    logger.error(`Missing language IDs for required locales: ${ActiveLanguage.EN}, ${ActiveLanguage.UK}`);
    throw new Error(`Missing language IDs for required locales: ${ActiveLanguage.EN}, ${ActiveLanguage.UK}`);
  }

  return [
    {
      position: data.uk.position,
      slug: slugify(data.uk.position),
      description: data.uk.description,
      type: data.type,
      salary_min: data.salaryMin,
      salary_max: data.salaryMax ?? null,
      language_id: ukLanguageId,
    },
    {
      position: data.en.position,
      slug: slugify(data.en.position),
      description: data.en.description,
      type: data.type,
      salary_min: data.salaryMin,
      salary_max: data.salaryMax ?? null,
      language_id: enLanguageId,
    },
  ];
}
