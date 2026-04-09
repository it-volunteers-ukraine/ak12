"use server";

import { logger } from "@/lib/logger";
import { HeroSchema } from "@/schemas";
import { SECTION_KEYS } from "@/constants";

import { saveContentAction } from "../content";

interface MultiLangHeroValues {
  en: HeroSchema;
  uk: HeroSchema;
}

export const updateHeroMultiLangAction = async (values: MultiLangHeroValues) => {
  try {
    const languages = Object.keys(values) as (keyof MultiLangHeroValues)[];

    const savePromises = languages.map((locale) => {
      const rawContent = values[locale];

      return saveContentAction({
        locale: locale,
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
