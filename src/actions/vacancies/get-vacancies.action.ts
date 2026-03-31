"use server";

import { getLocale } from "next-intl/server";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { Locale } from "@/types/locale";
import { VacancyMapped } from "@/types/vacancy";

export async function getVacancies(): Promise<{ vacancies: VacancyMapped[] }> {
  const locale = (await getLocale()) as Locale;

  return vacancyService.getAll({ locale });
}
