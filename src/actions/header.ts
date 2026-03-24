import { revalidatePath } from "next/cache";

import { Locale } from "@/types";
import { headerContentSchema } from "@/schemas";

import { saveSectionContent } from "./saveSectionContent";
import { SECTION_KEYS } from "@/constants";

type SaveHeaderActionParams = {
  locale: Locale;
  rawContent: unknown;
};

export const saveHeaderAction = async ({ locale, rawContent }: SaveHeaderActionParams) => {
  "use server";

  const result = await saveSectionContent({
    locale,
    rawContent,
    schema: headerContentSchema,
    sectionKey: SECTION_KEYS.HEADER,
  });

  if (result.success) {
    revalidatePath("/{locale}");
    revalidatePath("{locale}/admin");
  }

  return result;
};
