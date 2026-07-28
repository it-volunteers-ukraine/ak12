import { ActiveLanguage } from "@/types";
import { logger } from "@/lib/logger/logger";
import { databaseClient } from "@/lib/database/database-client";

export async function getLanguageMap(): Promise<Record<ActiveLanguage, string>> {
  const { data, error } = await databaseClient.from("language").select("id, code");

  if (error) {
    logger.error({ error }, "Failed to get languages");
    throw new Error(error.message);
  }

  return Object.fromEntries(data.map((l) => [l.code, l.id]));
}
