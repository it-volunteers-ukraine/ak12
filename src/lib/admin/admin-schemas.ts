import { z } from "zod";

import { heroContentSchema } from "@/schemas/hero-content.schema";
import { mobilizationSchema } from "@/schemas/mobilization.schema";
import {
  aboutUsSchema,
  transferSchema,
  contract1824Schema,
  feedbackContentSchema,
  headerAndFooterContentSchema,
  privacyPolicySchema,
} from "@/schemas";

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
  feedback: withMultiLang(feedbackContentSchema),
  mobilization: withMultiLang(mobilizationSchema),
  "contract-18-24": withMultiLang(contract1824Schema),
  "header-footer": withMultiLang(headerAndFooterContentSchema),
  "privacy-policy": withMultiLang(privacyPolicySchema),
} as const;
