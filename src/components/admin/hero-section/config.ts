import z from "zod";

import { heroContentSchema } from "@/schemas";

export interface IHeroSection {
  data: AdminData;
}
export type AdminData = z.infer<typeof adminSchema>;

export const adminSchema = z.object({
  uk: heroContentSchema,
  en: heroContentSchema,
});
