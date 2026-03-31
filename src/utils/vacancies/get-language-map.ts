import { logger } from "@/lib/logger";
import { supabaseServer } from "@/lib/supabase-server";
import { ActiveLanguage } from "@/types";

export async function getLanguageMap(): Promise<Record<ActiveLanguage, string>> {
  const { data, error } = await supabaseServer.from("language").select("id, code");

  if (error) {
    logger.error({ error }, "Failed to get languages");
    throw new Error(error.message);
  }

  return Object.fromEntries(data.map((l) => [l.code, l.id]));
}
