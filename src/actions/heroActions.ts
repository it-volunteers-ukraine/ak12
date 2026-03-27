"use server";

import { cache } from "react";

import { Locale } from "@/types";
import { logger } from "@/lib/logger";
import { SECTION_KEYS } from "@/constants";
import { supabaseServer } from "@/lib/supabase-server";
import { HeroSchema, heroContentSchema } from "@/schemas/heroSchema";

import { saveContentAction } from "./content";
import { ensureLanguage } from "./ensureLanguage";

export const getHeroSectionContentAction = cache(async <T = HeroSchema>(locale: Locale): Promise<T | null> => {
  const languageRow = await ensureLanguage(locale);

  const { data, error } = await supabaseServer
    .from("site_content")
    .select("content")
    .eq("section_key", "hero")
    .eq("language_id", languageRow.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching section 'hero':`, error);

    return null;
  }

  return (data?.content as T) || null;
});

export const updateHeroSectionAction = async (formData: FormData, locale: Locale) => {
  try {
    const rawContent = Object.fromEntries(formData.entries());

    console.log("1. Raw data from form:", rawContent);
    const parsed = heroContentSchema.safeParse(rawContent);

    if (!parsed.success) {
      console.error("[Validation Error]:", parsed.error.flatten());

      return {
        success: false,
        error: "Дані форми не пройшли перевірку Zod.",
      };
    }

    const validatedContent = parsed.data;
    const languageRow = await ensureLanguage(locale);

    console.log("3. Language found:", languageRow.id);

    const { error } = await supabaseServer
      .from("site_content")
      .update({
        content: validatedContent,
        updated_at: new Date().toISOString(),
      })
      .eq("section_key", "hero")
      .eq("language_id", languageRow.id)
      .select();

    if (error) {
      console.error("4. Supabase Error:", error.message);
      throw error;
    }

    console.log("5. Success! Updated rows:", parsed.data);

    return { success: true };
  } catch (error: any) {
    console.error("Action Error:", error);

    return { success: false, error: "Помилка сервера при збереженні" };
  }
};

export const updateHeroMultiLangAction = async (formData: FormData) => {
  const rawData = Object.fromEntries(formData.entries());

  const languages = [
    { locale: "uk" as const, suffix: "Uk" },
    { locale: "en" as const, suffix: "En" },
  ];

  try {
    const savePromises = languages.map((lang) => {
      const btnText = rawData[`primaryButtonText${lang.suffix}`];
      const btnLink = rawData[`primaryButtonLink${lang.suffix}`];
      const rawContent = {
        title: rawData[`title${lang.suffix}`],
        subtitle: rawData[`subtitle${lang.suffix}`],
        backgroundImage: rawData["backgroundImage"],
        primaryButton: btnText
          ? {
              text: String(btnText),
              link: String(btnLink || ""),
            }
          : undefined,
      };

      return saveContentAction({
        locale: lang.locale,
        sectionKey: SECTION_KEYS.HERO,
        rawContent,
      });
    });

    const results = await Promise.all(savePromises);

    const firstError = results.find((res) => !res.success);

    if (firstError) {
      logger.warn({ firstError }, "Multi-lang partial failure");

      return firstError;
    }

    return { success: true };
  } catch (error) {
    logger.error({ error, section: SECTION_KEYS.HERO }, "Multi-lang update fatal error");

    return { success: false, error: "Internal Server Error" };
  }
};
