"use server";

import { Locale } from "@/types";
import { SECTION_KEYS } from "@/constants";
import { logger } from "@/lib/logger/logger";
import { AdminDataMap } from "@/lib/admin";
import { saveContentAction } from "@/actions/content/content.action";

type AdminData = AdminDataMap["about"];

export const updateAboutMultiLangAction = async (values: AdminData) => {
  try {
    const languages = Object.keys(values) as Locale[];

    const savePromises = languages.map((locale) => {
      const rawContent = values[locale];

      return saveContentAction({
        locale,
        rawContent,
        sectionKey: SECTION_KEYS.ABOUT,
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
    logger.error({ error, section: SECTION_KEYS.ABOUT }, "Multi-lang update fatal error");

    return { success: false, error: "Internal Server Error" };
  }
};
