"use server";

import { SECTION_KEYS } from "@/constants";
import { Locale } from "@/types";
import { logger } from "@/lib/logger";
import { AdminDataMap } from "@/lib/admin";
import { saveContentAction } from "@/actions/content/content.action";

type AdminData = AdminDataMap["contract-18-24"];

export const updateContract1824MultiLangAction = async (values: AdminData) => {
  try {
    const languages = Object.keys(values) as Locale[];

    const savePromises = languages.map((locale) => {
      const rawContent = values[locale];

      return saveContentAction({
        rawContent,
        locale: locale,
        sectionKey: SECTION_KEYS.CONTRACT_18_24,
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
    logger.error({ error, section: SECTION_KEYS.CONTRACT_18_24 }, "Multi-lang update fatal error");

    return { success: false, error: "Internal Server Error" };
  }
};
