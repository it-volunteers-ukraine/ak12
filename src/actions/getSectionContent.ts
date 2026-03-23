import { z } from "zod";
import { cache } from "react";

import { Locale } from "@/types";
import { ensureLanguage } from "./ensureLanguage";
import { supabaseServer } from "@/lib/supabase-server";

type GetSectionContentParams = {
  section: string;
  locale: Locale;
};

type GetSafeSectionContentParams<Schema extends z.ZodTypeAny> = {
  section: string;
  locale: Locale;
  schema: Schema;
};

export const getSectionContent = cache(async <T>({ section, locale }: GetSectionContentParams): Promise<T | null> => {
  const languageRow = await ensureLanguage(locale);

  const { data, error } = await supabaseServer
    .from("site_content")
    .select("content")
    .eq("section_key", section)
    .eq("is_active", true)
    .eq("language_id", languageRow.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data?.content) {
    return null;
  }

  return data.content as T;
});

export const getSafeSectionContent = cache(
  async <Schema extends z.ZodTypeAny>({
    section,
    locale,
    schema,
  }: GetSafeSectionContentParams<Schema>): Promise<z.infer<Schema> | null> => {
    const data = await getSectionContent<z.infer<Schema>>({ section, locale });
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      console.error(`Invalid content for ${section}:`, parsed.error);

      return null;
    }

    return parsed.data;
  },
);
