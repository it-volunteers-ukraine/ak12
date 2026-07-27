import { DatabaseClient } from "./types";
import { getSupabaseClient } from "./supabase.client";
import { postgresClient } from "./postgres.client";

let dbClient: DatabaseClient | null = null;

export function getDbClient(): DatabaseClient {
  if (!dbClient) {
    const isProduction = process.env.NODE_ENV === "production";

    // The non-selected client is never constructed, so its env vars are not
    // required (e.g. production doesn't need Supabase configured, and vice versa).
    dbClient = isProduction ? postgresClient : getSupabaseClient();
  }

  return dbClient;
}
