"use server";

import { VacancyMapped } from "@/types/vacancy";
import { vacancyService } from "@/lib/vacancies/vacancy.service";

export async function getAllVacanciesAdmin(): Promise<{ uk: VacancyMapped[]; en: VacancyMapped[] }> {
  return vacancyService.getAllAdmin();
}
