"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { Locale } from "@/types";
import { SectionKey, SECTION_KEYS } from "@/constants";
import { contentService } from "@/lib/content/content.service";
import { mobilizationSchema } from "@/schemas/mobilizationSchema";
import { lifeOfUnitSchema } from "@/schemas/life-of-the-unit.schema";
import {
  heroContentSchema,
  contract1824Schema,
  headerContentSchema,
  contactsContentSchema,
  feedbackContentSchema,
} from "@/schemas";

type SaveContentAction = {
  locale: Locale;
  rawContent: unknown;
  sectionKey: SectionKey;
};

const schemasMap: Record<SectionKey, z.ZodType> = {
  [SECTION_KEYS.HERO]: heroContentSchema,
  [SECTION_KEYS.HEADER]: headerContentSchema,
  [SECTION_KEYS.LIFE_OF_UNIT]: lifeOfUnitSchema,
  [SECTION_KEYS.FEEDBACK]: feedbackContentSchema,
  [SECTION_KEYS.CONTACTS]: contactsContentSchema,
  [SECTION_KEYS.MOBILIZATION]: mobilizationSchema,
  [SECTION_KEYS.CONTRACT_18_24]: contract1824Schema,
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
