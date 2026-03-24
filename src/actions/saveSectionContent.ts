import { supabaseServer } from "@/lib/supabase-server";
import { ensureLanguage } from "./ensureLanguage";
import { z } from "zod";
import { Locale } from "@/types";
import { SectionKey } from "@/constants";

export type ActionResponse<T = void> = { success: true; data?: T } | { success: false; error: string };

type SaveSectionContentParams<Schema extends z.ZodTypeAny> = {
  locale: Locale;
  schema: Schema;
  rawContent: unknown;
  sectionKey: SectionKey;
};

export const saveSectionContent = async <Schema extends z.ZodTypeAny>({
  locale,
  schema,
  rawContent,
  sectionKey,
}: SaveSectionContentParams<Schema>): Promise<ActionResponse<z.infer<Schema>>> => {
  try {
    const parsed = schema.safeParse(rawContent);

    if (!parsed.success) {
      console.error(`[Validation Error - ${sectionKey}]:`, parsed.error.flatten());

      return { success: false, error: "Invalid form data" };
    }

    const content = parsed.data;
    const languageRow = await ensureLanguage(locale);

    const { data: existingRows, error: existingError } = await supabaseServer
      .from("site_content")
      .select("id")
      .eq("section_key", sectionKey)
      .eq("language_id", languageRow.id)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (existingError) {
      throw existingError;
    }

    const existingId = existingRows?.[0]?.id;

    if (existingId) {
      const { error } = await supabaseServer
        .from("site_content")
        .update({ content, is_active: true, updated_at: new Date().toISOString() })
        .eq("id", existingId);

      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabaseServer
        .from("site_content")
        .insert({ section_key: sectionKey, content, is_active: true, language_id: languageRow.id });

      if (error) {
        throw error;
      }
    }

    return { success: true, data: content };
  } catch (error) {
    console.error(`[upsertSectionContent - ${sectionKey}]:`, error);

    return { success: false, error: `Error saving section ${sectionKey}` };
  }
};
