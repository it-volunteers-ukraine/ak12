import { cache } from "react";
import z from "zod";
import { Locale } from "@/types";
import { SectionKey } from "@/constants";
import { logger } from "@/lib/logger/logger";
import { supabaseServer } from "@/lib/supabase-server/supabase-server";
import { languageService } from "@/lib/language/language.service";

export type ActionResponse<T = void> = { success: true; data?: T } | { success: false; error: string };
interface GetSafeParams<Schema extends z.ZodTypeAny> {
  locale: Locale;
  schema: Schema;
  section: SectionKey;
}
interface SaveParams<Schema extends z.ZodTypeAny> {
  locale: Locale;
  schema: Schema;
  rawContent: unknown;
  sectionKey: SectionKey;
}

const _findContentRecord = cache(async (sectionKey: SectionKey, locale: Locale) => {
  const languageRow = await languageService.ensure(locale);

  const { data, error } = await supabaseServer
    .from("site_content")
    .select("id, content, updated_at")
    .eq("section_key", sectionKey)
    .eq("is_active", true)
    .eq("language_id", languageRow.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    logger.error({ sectionKey, locale, error }, "Failed to find content record");

    return null;
  }

  return data;
});

const normalizeTimestampToIsoUtc = (value: string | Date): string | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  const trimmed = value.trim();
  const withT = trimmed.includes("T") ? trimmed : trimmed.replaceAll(" ", "T");

  const normalized = /[zZ]|[+-]\d{2}:\d{2}$/.test(withT) ? withT : `${withT}Z`;

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

export const contentService = {
  async getBatchWithLatestTimestamps({
    locale,
    sections,
  }: {
    locale: Locale;
    sections: SectionKey[];
  }): Promise<Record<string, string>> {
    if (!sections.length) {
      return {};
    }

    try {
      const languageRow = await languageService.ensure(locale);

      const { data, error } = await supabaseServer
        .from("site_content")
        .select("section_key, updated_at")
        .eq("is_active", true)
        .eq("language_id", languageRow.id)
        .in("section_key", sections)
        .order("updated_at", { ascending: false });

      if (error) {
        logger.error({ locale, sections, error }, "Failed to fetch batch timestamps");

        return {};
      }

      if (!data) {
        return {};
      }

      const timestampMap: Record<string, string> = {};

      for (const record of data) {
        if (record.section_key && record.updated_at && !timestampMap[record.section_key]) {
          const normalized = normalizeTimestampToIsoUtc(record.updated_at);

          if (normalized !== null) {
            timestampMap[record.section_key] = normalized;
          }
        }
      }

      return timestampMap;
    } catch (error) {
      logger.error({ locale, sections, error }, "Unexpected error in getBatchWithLatestTimestamps");

      return {};
    }
  },

  async getUpdatedAt({ locale, section }: { locale: Locale; section: SectionKey }): Promise<string | null> {
    const record = await _findContentRecord(section, locale);

    if (!record?.updated_at) {
      return null;
    }

    return normalizeTimestampToIsoUtc(record.updated_at);
  },

  async get<Schema extends z.ZodTypeAny>({
    locale,
    schema,
    section,
  }: GetSafeParams<Schema>): Promise<z.infer<Schema> | null> {
    const record = await _findContentRecord(section, locale);

    if (!record?.content) {
      return null;
    }

    const parsed = schema.safeParse(record.content);

    if (!parsed.success) {
      logger.error({ section, error: z.flattenError(parsed.error) }, "Invalid section content");

      return null;
    }

    return parsed.data;
  },

  async save<Schema extends z.ZodTypeAny>({
    locale,
    schema,
    sectionKey,
    rawContent,
  }: SaveParams<Schema>): Promise<ActionResponse<z.infer<Schema>>> {
    try {
      const parsed = schema.safeParse(rawContent);

      if (!parsed.success) {
        logger.error({ sectionKey, error: z.flattenError(parsed.error) }, "Invalid form data before save");

        return { success: false, error: "Invalid form data" };
      }

      const content = parsed.data;

      const record = await _findContentRecord(sectionKey, locale);

      if (record?.id) {
        const { error } = await supabaseServer
          .from("site_content")
          .update({ content, is_active: true, updated_at: new Date().toISOString() })
          .eq("id", record?.id);

        if (error) {
          throw error;
        }
      } else {
        const languageRow = await languageService.ensure(locale);

        const { error } = await supabaseServer
          .from("site_content")
          .insert({ section_key: sectionKey, content, is_active: true, language_id: languageRow.id });

        if (error) {
          throw error;
        }
      }

      return { success: true, data: content };
    } catch (error) {
      logger.error({ sectionKey, error }, "Error saving section");

      return { success: false, error: `Error saving section ${sectionKey}` };
    }
  },
};
