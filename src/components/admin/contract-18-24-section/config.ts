import { z } from "zod";

import { contract1824Schema } from "@/schemas";

export type AdminData = z.infer<typeof adminSchema>;
export interface IContract1824Section {
  data: AdminData;
}

export const adminSchema = z.object({
  uk: contract1824Schema,
  en: contract1824Schema,
});
