"use server";

import { getLocale } from "next-intl/server";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { VacancyType } from "@/types/vacancy";
import { Locale } from "@/types/locale";

export async function getVacancies(type: VacancyType, page: number, limit: number) {
  const locale = (await getLocale()) as Locale;

  return vacancyService.getAll({
    locale,
    type,
    page,
    limit,
  });
}
