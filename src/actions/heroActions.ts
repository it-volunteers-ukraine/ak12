"use server";

import { logger } from "@/lib/logger";
import { SECTION_KEYS } from "@/constants";

import { saveContentAction } from "./content";

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
