import { VacancyWithLanguage, VacancyMapped } from "@/types/vacancy";

export const mapVacancy = (vacancy: VacancyWithLanguage): VacancyMapped => ({
  id: vacancy.id,
  position: vacancy.position,
  slug: vacancy.slug,
  description: vacancy.description,
  type: vacancy.type,
  salaryMin: vacancy.salary_min,
  salaryMax: vacancy.salary_max,
  imageUrl: vacancy.image_url,
  isActive: vacancy.is_active,
  sortOrder: vacancy.sort_order,
  language: vacancy.language,
});
