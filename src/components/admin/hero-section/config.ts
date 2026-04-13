import { z } from "zod";

import { heroContentSchema } from "@/schemas";

export const adminSchema = z.object({
  uk: heroContentSchema,
  en: heroContentSchema,
});

export type AdminData = z.infer<typeof adminSchema>;

export interface IHeroSection {
  data: AdminData;
}
