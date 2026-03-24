import { revalidatePath } from "next/cache";

import { Locale } from "@/types";
import { SECTION_KEYS } from "@/constants";
import { contactsContentSchema } from "@/schemas";
import { saveSectionContent } from "./saveSectionContent";

type SaveContactsActionParams = {
  locale: Locale;
  rawContent: unknown;
};

export const saveContactsAction = async ({ locale, rawContent }: SaveContactsActionParams) => {
  "use server";

  const result = await saveSectionContent({
    locale,
    rawContent,
    schema: contactsContentSchema,
    sectionKey: SECTION_KEYS.CONTACTS,
  });

  if (result.success) {
    revalidatePath("/");
    revalidatePath("/admin");
  }

  return result;
};
