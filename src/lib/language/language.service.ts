import { Locale } from "@/types";
import { cache } from "react";
import { supabaseServer } from "../supabase-server";
import { logger } from "../logger";

type LanguageRow = {
  id: string;
};

const _ensureLanguageCached = cache(async (locale: Locale): Promise<LanguageRow> => {
  const { data: existingLanguage, error: selectError } = await supabaseServer
    .from("language")
    .select("id")
    .eq("code", locale)
    .maybeSingle();

  if (selectError) {
    logger.error({ locale, error: selectError }, "Failed to read language from DB");
    throw new Error(`Failed to read language ${locale}`);
  }

  if (existingLanguage?.id) {
    return existingLanguage;
  }

  logger.info({ locale }, "Language not found, creating new one...");

  const { data: insertedLanguage, error: insertError } = await supabaseServer
    .from("language")
    .insert({ code: locale })
    .select("id")
    .single();

  if (insertError || !insertedLanguage?.id) {
    logger.error({ locale, error: insertError }, "Failed to insert new language to DB");
    throw new Error(`Failed to create language ${locale}`);
  }

  return insertedLanguage;
});

export const languageService = {
  async ensure(locale: Locale): Promise<LanguageRow> {
    return _ensureLanguageCached(locale);
  },
};
