import { CreateVacancyDto } from "@/lib/vacancies/schemas/create-vacancy.schema";
import { ActiveLanguage } from "@/types/enum";
import { slugify } from "transliteration";

export function mapCreateVacancy(data: CreateVacancyDto, langMap: Record<ActiveLanguage, string>) {
  return [
    {
      position: data.uk.position,
      slug: slugify(data.uk.position),
      description: data.uk.description,
      type: data.type,
      salary_min: data.salary_min,
      salary_max: data.salary_max,
      language_id: langMap.uk,
    },
    {
      position: data.en.position,
      slug: slugify(data.en.position),
      description: data.en.description,
      type: data.type,
      salary_min: data.salary_min,
      salary_max: data.salary_max,
      language_id: langMap.en,
    },
  ];
}
