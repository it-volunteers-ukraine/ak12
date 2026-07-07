import { Locale } from "@/types/locale";
import { VacancyMapped } from "@/types/vacancy";
import { CreateVacancyDto } from "@/schemas/vacancies/create-vacancy.schema";
import { UpdateVacancyDto } from "@/schemas/vacancies/update-vacancy.schema";
import { DeleteVacancyDto } from "@/schemas/vacancies/delete-vacancy.schema";
import { UpdateVacancyStatusDto } from "@/schemas/vacancies/update-vacancy-status.schema";
import { ReorderVacanciesDto } from "@/schemas/vacancies/reorder-vacancy.schema";
import { mapVacancy } from "@/utils/vacancies/map-vacancy";
import { getLanguageMap } from "@/utils/vacancies/get-language-map";
import { mapCreateVacancy } from "@/utils/vacancies/map-create-vacancy";
import { buildUpdateVacancyArgs } from "@/utils/vacancies/build-update-vacancy-args";
import { supabaseServer } from "@/lib/supabase-server/supabase-server";
import { logger } from "@/lib/logger/logger";

interface Params {
  locale: Locale;
}

export const vacancyService = {
  async getAll({ locale }: Params): Promise<{ vacancies: VacancyMapped[] }> {
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

  async getAllAdmin(): Promise<{ uk: VacancyMapped[]; en: VacancyMapped[] }> {
    const { data, error } = await supabaseServer
      .from("vacancy")
      .select("*, language:language_id!inner(code)")
      .order("sort_order", { ascending: true });

    if (error) {
      logger.error({ error }, "Failed to fetch all vacancies for admin");
      throw new Error(error.message);
    }

    const all = (data ?? []).map(mapVacancy);

    return {
      uk: all.filter((v) => v.language.code === "uk"),
      en: all.filter((v) => v.language.code === "en"),
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
      logger.error({ error, ids: { ukId: data.ukId, enId: data.enId } }, "Failed to update vacancies");
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

  async updateStatus(data: UpdateVacancyStatusDto): Promise<void> {
    const { ukId, enId } = data;

    const { error } = await supabaseServer.rpc("update_vacancy_status_atomic", {
      uk_id: ukId,
      en_id: enId,
      new_status: data.isActive,
    });

    if (error) {
      logger.error({ error, ids: { ukId, enId } }, "Failed to update status of vacancies");
      throw new Error(error.message);
    }

    logger.info(`Status of vacancies '${ukId}' and '${enId}' successfully updated`);
  },

  async reorder(data: ReorderVacanciesDto): Promise<void> {
    const { error } = await supabaseServer.rpc("reorder_vacancies_atomic", {
      payload: data,
    });

    if (error) {
      logger.error({ error, data }, "Failed to reorder vacancies");
      throw new Error(error.message);
    }

    logger.info("Vacancies successfully reordered");
  },
};
