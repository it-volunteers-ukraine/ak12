import { z } from "zod";

import { heroContentSchema } from "@/schemas/heroContent";
import { transferSchema, contract1824Schema, headerAndFooterContentSchema, feedbackContentSchema } from "@/schemas";
import { mobilizationSchema } from "@/schemas/mobilizationSchema";

const withMultiLang = <S extends z.ZodRawShape>(schema: z.ZodObject<S>) => {
  return z.object({
    uk: schema,
    en: schema,
  });
};

export const ADMIN_SCHEMAS = {
  hero: withMultiLang(heroContentSchema),

  mobilization: withMultiLang(mobilizationSchema),

  "contract-18-24": withMultiLang(contract1824Schema),

  transfer: withMultiLang(transferSchema),

  feedback: withMultiLang(feedbackContentSchema),

  "header-footer": withMultiLang(headerAndFooterContentSchema),
} as const;
