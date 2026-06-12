"use server";

import { Locale } from "@/types";
import { logger } from "@/lib/logger";
import { AdminDataMap } from "@/lib/admin";
import { SECTION_KEYS } from "@/constants";

import { saveContentAction } from "../content/content";

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
