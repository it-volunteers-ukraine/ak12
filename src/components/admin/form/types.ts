import z from "zod";
import { HeroSchema, heroContentSchema } from "@/schemas";
import { MobilizationSchema, mobilizationSchema } from "@/schemas/mobilizationSchema";
import {
  subdivisionContentSchema,
  SubdivisionContent,
} from "@/components/admin/subdivisions-section/config";

type MultiLang<S extends z.ZodRawShape, D> = {
  data: { en: D; uk: D };
  schema: z.ZodObject<{
    en: z.ZodObject<S>;
    uk: z.ZodObject<S>;
  }>;
};

export type AllAdminForms =
  | ({ type: "hero" } & MultiLang<typeof heroContentSchema.shape, HeroSchema>)
  | ({ type: "mobilization" } & MultiLang<typeof mobilizationSchema.shape, MobilizationSchema>)
  | ({ type: "subdivision" } & MultiLang<typeof subdivisionContentSchema.shape, SubdivisionContent>);