"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { Locale } from "@/types";
import { SectionKey, SECTION_KEYS } from "@/constants";
import { contentService } from "@/lib/content/content.service";
import { mobilizationSchema } from "@/schemas/mobilizationSchema";
import { lifeOfUnitSchema } from "@/schemas/life-of-the-unit.schema";
import {
  transferSchema,
  heroContentSchema,
  contract1824Schema,
  contactsContentSchema,
  feedbackContentSchema,
  headerAndFooterContentSchema,
} from "@/schemas";
import { logger } from "@/lib/logger";
import { AdminDataMap, AdminSectionKey } from "@/lib/admin";

type SaveContentAction = {
  locale: Locale;
  rawContent: unknown;
  sectionKey: SectionKey;
};

const schemasMap: Record<SectionKey, z.ZodType> = {
  [SECTION_KEYS.HERO]: heroContentSchema,
  [SECTION_KEYS.TRANSFER]: transferSchema,
  [SECTION_KEYS.LIFE_OF_UNIT]: lifeOfUnitSchema,
  [SECTION_KEYS.FEEDBACK]: feedbackContentSchema,
  [SECTION_KEYS.CONTACTS]: contactsContentSchema,
  [SECTION_KEYS.MOBILIZATION]: mobilizationSchema,
  [SECTION_KEYS.CONTRACT_18_24]: contract1824Schema,
  [SECTION_KEYS.HEADER]: headerAndFooterContentSchema,
};

export const saveContentAction = async ({ locale, sectionKey, rawContent }: SaveContentAction) => {
  const schema = schemasMap[sectionKey];

  if (!schema) {
    return { success: false, error: `Schema for section ${sectionKey} not found` };
  }

  const result = await contentService.save({
    locale,
    schema,
    rawContent,
    sectionKey,
  });

  if (result.success) {
    revalidatePath("/");
    revalidatePath("/admin");
  }

  return result;
};

export const updateContentMultiLang = async <K extends AdminSectionKey>(section: K, values: AdminDataMap[K]) => {
  try {
    const languages = Object.keys(values) as Locale[];

    const savePromises = languages.map((locale) => {
      const rawContent = values[locale];

      return saveContentAction({
        rawContent,
        locale: locale,
        sectionKey: section,
      });
    });

    const results = await Promise.allSettled(savePromises);

    const failures = results.filter(
      (res) => res.status === "rejected" || (res.status === "fulfilled" && !res.value.success),
    );

    if (failures.length > 0) {
      logger.error({ failures, section }, "Multi-lang partial failure – data may be inconsistent across locales");

      return {
        success: false,
        error: "Помилка збереження. Дані для деяких мов могли не оновитися.",
      };
    }

    return { success: true };
  } catch (error) {
    logger.error({ error, section }, "Multi-lang update fatal error");

    return { success: false, error: "Internal Server Error" };
  }
};
