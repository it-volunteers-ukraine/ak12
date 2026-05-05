import { z } from "zod";

import { heroContentSchema } from "@/schemas/heroContent";
import { mobilizationSchema } from "@/schemas/mobilizationSchema";
import { aboutUsSchema, transferSchema, contract1824Schema, headerAndFooterContentSchema } from "@/schemas";

const withMultiLang = <S extends z.ZodRawShape>(schema: z.ZodObject<S>) => {
  return z.object({
    uk: schema,
    en: schema,
  });
};

export const ADMIN_SCHEMAS = {
  about: withMultiLang(aboutUsSchema),
  hero: withMultiLang(heroContentSchema),
  transfer: withMultiLang(transferSchema),
  mobilization: withMultiLang(mobilizationSchema),
  "contract-18-24": withMultiLang(contract1824Schema),
  "header-footer": withMultiLang(headerAndFooterContentSchema),
} as const;
