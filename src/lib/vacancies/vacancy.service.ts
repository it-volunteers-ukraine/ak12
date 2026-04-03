import { Locale } from "@/types/locale";
import { VacancyMapped } from "@/types/vacancy";
import { supabaseServer } from "@/lib/supabase-server";
import { logger } from "@/lib/logger";
import { mapVacancy } from "@/utils/vacancies/map-vacancy";
import { CreateVacancyDto } from "../../schemas/create-vacancy.schema";
import { getLanguageMap } from "@/utils/vacancies/get-language-map";
import { mapCreateVacancy } from "@/utils/vacancies/map-create-vacancy";
import { UpdateVacancyDto } from "@/schemas/update-vacancy.schema";
import { buildUpdateVacancyArgs } from "@/utils/vacancies/build-update-vacancy-args";
import { DeleteVacancyDto } from "@/schemas/delete-vacancy.schema";

interface Params {
  locale: Locale;
}

export const vacancyService = {
  async getAll({ locale }: Params): Promise<{ vacancies: VacancyMapped[] }> {
    // Recommended index:
    // CREATE INDEX idx_vacancy_active_lang_type_sort ON vacancy(type, is_active, language_id, sort_order);
    const query = supabaseServer
      .from("vacancy")
      .select("*, language:language_id!inner(code)")
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

  async create(data: CreateVacancyDto): Promise<VacancyMapped[]> {
    const langMap = await getLanguageMap();

    const rows = mapCreateVacancy(data, langMap);

    const { data: createdVacancy, error } = await supabaseServer
      .from("vacancy")
      .insert(rows)
      .select("*, language:language_id!inner(code)");

    if (error) {
      logger.error({ error, data }, "Failed to create vacancy");
      throw new Error(error.message);
    }

    logger.info("Vacancies successfully created");

    return createdVacancy.map(mapVacancy);
  },

  async update(data: UpdateVacancyDto): Promise<VacancyMapped[]> {
    const args = buildUpdateVacancyArgs(data);

    const { data: updatedVacancies, error } = await supabaseServer.rpc("update_vacancy_atomic", args);

    if (error) {
      logger.error({ error, ukId: data.ukId, enId: data.enId }, "Failed to update vacancies");
      throw new Error(error.message);
    }

    logger.info(`Vacancies '${data.ukId}' and '${data.enId}' successfully updated`);

    return updatedVacancies.map(mapVacancy);
  },

  async delete(ids: DeleteVacancyDto): Promise<void> {
    const { error } = await supabaseServer.rpc("delete_vacancy_atomic", {
      uk_id: ids.ukId,
      en_id: ids.enId,
    });

    if (error) {
      logger.error({ error, ids }, "Failed to delete vacancies");
      throw new Error(error.message);
    }

    logger.info(`Vacancies '${ids.ukId}' and '${ids.enId}' successfully deleted`);
  },
};
