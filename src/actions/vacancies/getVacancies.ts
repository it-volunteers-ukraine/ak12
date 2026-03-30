"use server";

import { getLocale } from "next-intl/server";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { Locale } from "@/types/locale";

export async function getVacancies() {
  const locale = (await getLocale()) as Locale;

  return vacancyService.getAll({ locale });
}
