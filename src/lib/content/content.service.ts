import z from "zod";

import { Locale } from "@/types";
import { logger } from "../logger";
import { SectionKey } from "@/constants";
import { supabaseServer } from "../supabase-server";
import { languageService } from "../language/language.service";
import { cache } from "react";

export type ActionResponse<T = void> = { success: true; data?: T } | { success: false; error: string };

interface GetSafeParams<Schema extends z.ZodTypeAny> {
  section: SectionKey;
  locale: Locale;
  schema: Schema;
}

interface SaveParams<Schema extends z.ZodTypeAny> {
  sectionKey: SectionKey;
  locale: Locale;
  schema: Schema;
  rawContent: unknown;
}

const _findContentRecord = cache(async (sectionKey: SectionKey, locale: Locale) => {
  const languageRow = await languageService.ensure(locale);

  const { data, error } = await supabaseServer
    .from("site_content")
    .select("id, content")
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

export const contentService = {
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
