"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { Locale } from "@/types";
import { SectionKey, SECTION_KEYS } from "@/constants";
import { contentService } from "@/lib/content/content.service";
import { heroContentSchema, headerContentSchema, contactsContentSchema } from "@/schemas";

type SaveContentAction = {
  locale: Locale;
  rawContent: unknown;
  sectionKey: SectionKey;
};

const schemasMap: Record<SectionKey, z.ZodType> = {
  [SECTION_KEYS.CONTACTS]: contactsContentSchema,
  [SECTION_KEYS.HEADER]: headerContentSchema,
  [SECTION_KEYS.HERO]: heroContentSchema,
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
