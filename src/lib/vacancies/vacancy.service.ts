import { Locale } from "@/types/locale";
import { VacancyMapped } from "@/types/vacancy";
import { supabaseServer } from "@/lib/supabase-server";
import { logger } from "@/lib/logger";
import { mapVacancy } from "@/utils/vacancies/mapVacancy";

interface Params {
  locale: Locale;
}

export const vacancyService = {
  async getAll({ locale }: Params): Promise<{ vacancies: VacancyMapped[] }> {
    // Recommended index:
    // CREATE INDEX idx_vacancy_active_lang_type_sort ON vacancy(type, is_active, language_id, sort_order);
    const query = supabaseServer
      .from("vacancy")
      .select("*, language:language_id!inner(code)", { count: "exact" })
      .eq("is_active", true)
      .eq("language.code", locale)
      .order("sort_order", { ascending: true });

    const { data, error } = await query;

    if (error) {
      logger.error({ error, locale }, "Failed to fetch vacancies");
      throw new Error(error.message);
    }

    return {
      vacancies: (data ?? []).map(mapVacancy),
    };
  },
};
