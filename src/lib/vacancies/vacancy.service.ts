import { Locale } from "@/types/locale";
import { DEFAULT_PAGE, DEFAULT_LIMIT, DEFAULT_TYPE } from "@/constants/pagination";
import { VacancyType, VacancyWithLanguage } from "@/types/vacancy";
import { supabaseServer } from "@/lib/supabase-server";
import { logger } from "@/lib/logger";

interface Params {
  locale: Locale;
  type?: VacancyType;
  page?: number;
  limit?: number;
}

export const vacancyService = {
  async getAll({
    locale,
    type = DEFAULT_TYPE,
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
  }: Params): Promise<{ data: VacancyWithLanguage[]; count: number }> {
    const from = page * limit;
    const to = from + limit - 1;

    // Recommended index:
    // CREATE INDEX idx_vacancy_active_lang_type_sort ON vacancy(type, is_active, language_id, sort_order);
    let query = supabaseServer
      .from("vacancy")
      .select(
        `
        *,
        language:language_id (code)
      `,
        { count: "exact" },
      )
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
      data: data ?? [],
      count: count ?? 0,
    };
  },
};
