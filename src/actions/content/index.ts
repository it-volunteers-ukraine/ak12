"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { Locale } from "@/types";
import { SECTION_KEYS, SectionKey } from "@/constants";
import { contentService } from "@/lib/content/content.service";
import { contactsContentSchema, headerContentSchema } from "@/schemas";

type SaveContentAction = {
  locale: Locale;
  sectionKey: SectionKey;
  rawContent: unknown;
};

const schemasMap: Record<SectionKey, z.ZodType> = {
  [SECTION_KEYS.CONTACTS]: contactsContentSchema,
  [SECTION_KEYS.HEADER]: headerContentSchema,
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
