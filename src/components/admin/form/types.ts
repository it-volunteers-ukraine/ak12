import z from "zod";

import { MobilizationSchema, mobilizationSchema } from "@/schemas/mobilizationSchema";
import { HeroSchema, heroContentSchema, Contract1824Schema, contract1824Schema } from "@/schemas";

type MultiLang<S extends z.ZodRawShape, D> = {
  data: {
    en: D;
    uk: D;
  };
  schema: z.ZodObject<{
    en: z.ZodObject<S>;
    uk: z.ZodObject<S>;
  }>;
};
export type AllAdminForms =
  | ({ type: "hero" } & MultiLang<typeof heroContentSchema.shape, HeroSchema>)
  | ({ type: "contract1824" } & MultiLang<typeof contract1824Schema.shape, Contract1824Schema>)
  | ({ type: "mobilization" } & MultiLang<typeof mobilizationSchema.shape, MobilizationSchema>);
