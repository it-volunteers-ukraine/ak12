"use server";

import { logger } from "@/lib/logger";
import { SECTION_KEYS } from "@/constants";
import { MobilizationSchema } from "@/schemas/mobilizationSchema";

import { saveContentAction } from "../content";

interface MultiLangMobilizationValues {
  en: MobilizationSchema;
  uk: MobilizationSchema;
}

export const updateMobilizationMultiLangAction = async (values: MultiLangMobilizationValues) => {
  try {
    const languages = Object.keys(values) as (keyof MultiLangMobilizationValues)[];

    const savePromises = languages.map((locale) => {
      const rawContent = values[locale];

      return saveContentAction({
        locale: locale,
        sectionKey: SECTION_KEYS.MOBILIZATION,
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
    logger.error({ error, section: SECTION_KEYS.MOBILIZATION }, "Multi-lang update fatal error");

    return { success: false, error: "Internal Server Error" };
  }
};
