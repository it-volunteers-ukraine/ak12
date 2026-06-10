"use server";

import { Locale } from "@/types";
import { logger } from "@/lib/logger";
import { AdminDataMap } from "@/lib/admin";
import { SECTION_KEYS } from "@/constants";

import { saveContentAction } from "../content";

type AdminData = AdminDataMap["transfer"];

export const updateTransferMultiLangAction = async (values: AdminData) => {
  try {
    const languages = Object.keys(values) as Locale[];

    const savePromises = languages.map((locale) => {
      const rawContent = values[locale];

      return saveContentAction({
        rawContent,
        locale: locale,
        sectionKey: SECTION_KEYS.TRANSFER,
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
    logger.error({ error, section: SECTION_KEYS.TRANSFER }, "Multi-lang update fatal error");

    return { success: false, error: "Internal Server Error" };
  }
};
