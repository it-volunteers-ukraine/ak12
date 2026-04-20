'use server';

import { getLocale } from "next-intl/server";

import { Locale } from "@/types/locale";
import { VacancyMapped } from "@/types/vacancy";
import { vacancyService } from "@/lib/vacancies/vacancy.service";

export async function getVacancies(): Promise<{ vacancies: VacancyMapped[] }> {
  const locale = (await getLocale()) as Locale;

  return vacancyService.getAll({ locale });
}
