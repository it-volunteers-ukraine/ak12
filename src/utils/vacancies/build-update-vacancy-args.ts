import { UpdateVacancyDto } from "@/schemas/update-vacancy.schema";

export function buildUpdateVacancyArgs(data: UpdateVacancyDto) {
  return {
    payload: {
      uk_id: data.ukId,
      en_id: data.enId,

      type: data.type,
      salary_min: data.salaryMin,
      salary_max: data.salaryMax ?? null,

      uk: {
        position: data.uk.position,
        description: data.uk.description,
        slug: data.uk.slug,
      },

      en: {
        position: data.en.position,
        description: data.en.description,
        slug: data.en.slug,
      },
    },
  };
}
