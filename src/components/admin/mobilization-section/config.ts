import { z } from "zod";

import { mobilizationSchema } from "@/schemas";

export type AdminData = z.infer<typeof adminSchema>;

export const adminSchema = z.object({
  uk: mobilizationSchema,
  en: mobilizationSchema,
});
