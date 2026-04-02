import { UpdateVacancyDto } from "@/schemas/update-vacancy.schema";
import { slugify } from "transliteration";

export function buildUpdateVacancyArgs(ids: { ukId: string; enId: string }, data: UpdateVacancyDto) {
  return {
    uk_id: ids.ukId,
    en_id: ids.enId,
    uk_position: data.uk.position,
    en_position: data.en.position,
    uk_slug: slugify(data.uk.position),
    en_slug: slugify(data.en.position),
    uk_description: data.uk.description,
    en_description: data.en.description,
    _type: data.type,
    _salary_min: data.salaryMin,
    _salary_max: data.salaryMax ?? null,
  };
}
