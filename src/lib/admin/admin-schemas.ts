import { z } from "zod";

import { contract1824Schema } from "@/schemas";
import { heroContentSchema } from "@/schemas/heroContent";
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
} as const;
