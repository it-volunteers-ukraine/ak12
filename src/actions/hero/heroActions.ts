"use server";

import { Locale } from "@/types";
import { logger } from "@/lib/logger";
import { SECTION_KEYS } from "@/constants";
import { AdminDataMap } from "@/lib/admin";

import { saveContentAction } from "../content";

type AdminData = AdminDataMap["hero"];

export const updateHeroMultiLangAction = async (values: AdminData) => {
  try {
    const languages = Object.keys(values) as Locale[];

    const savePromises = languages.map((locale) => {
      const rawContent = values[locale];

      return saveContentAction({
        locale,
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
