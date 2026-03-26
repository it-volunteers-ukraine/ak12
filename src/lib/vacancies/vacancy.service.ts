import { Locale } from "@/types/locale";
import { VacancyMapped, VacancyType } from "@/types/vacancy";
import { supabaseServer } from "@/lib/supabase-server";
import { logger } from "@/lib/logger";
import { mapVacancy } from "@/utils/vacancies/mapVacancy";

interface Params {
  locale: Locale;
  type: VacancyType;
  page: number;
  limit: number;
}

export const vacancyService = {
  async getAll({ locale, type, page, limit }: Params): Promise<{ vacancies: VacancyMapped[]; total: number }> {
    const from = 0;
    const to = (page + 1) * limit - 1;

    // Recommended index:
    // CREATE INDEX idx_vacancy_active_lang_type_sort ON vacancy(type, is_active, language_id, sort_order);
    const query = supabaseServer
      .from("vacancy")
      .select("*, language:language_id!inner(code)", { count: "exact" })
      .eq("type", type)
      .eq("is_active", true)
      .eq("language.code", locale)
      .order("sort_order", { ascending: true })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      logger.error({ error, locale, type }, "Failed to fetch vacancies");
      throw new Error(error.message);
    }

    return {
      vacancies: (data ?? []).map(mapVacancy),
      total: count ?? 0,
    };
  },
};
