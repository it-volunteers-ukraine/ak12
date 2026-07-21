import { DatabaseClient } from "./types";
import { supabaseClient } from "./supabase.client";
import { postgresClient } from "./postgres.client";

let dbClient: DatabaseClient | null = null;

export function getDbClient(): DatabaseClient {
  if (!dbClient) {
    const isProduction = process.env.NODE_ENV === "production";

    dbClient = isProduction ? postgresClient : supabaseClient;
  }

  return dbClient;
}
