"use server";

import { logger } from "@/lib/logger";
import { SECTION_KEYS } from "@/constants";
import { AdminData } from "@/components/admin/hero-section/config";

import { saveContentAction } from "../content";

export const updateHeroMultiLangAction = async (values: AdminData) => {
  try {
    const languages = Object.keys(values) as (keyof AdminData)[];

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
