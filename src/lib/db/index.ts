import { DatabaseClient } from "./types";
import { getSupabaseClient } from "./supabase.client";
import { postgresClient } from "./postgres.client";
import { logger } from "@/lib/logger/logger";

let dbClient: DatabaseClient | null = null;

export function getDbClient(): DatabaseClient {
  if (!dbClient) {
    // DB_CLIENT is the authoritative driver switch, decoupled from NODE_ENV
    // (which must be "production" for `next build`). When unset, fall back to the
    // legacy heuristic so existing prod (Postgres) / dev (Supabase) envs keep working.
    const explicit = process.env.DB_CLIENT;
    const useSupabase = explicit
      ? explicit === "supabase"
      : process.env.NODE_ENV !== "production";

    // The non-selected client is never constructed, so its env vars are not
    // required (e.g. Postgres doesn't need Supabase configured, and vice versa).
    dbClient = useSupabase ? getSupabaseClient() : postgresClient;
    logger.info({ driver: useSupabase ? "supabase" : "postgres" }, "Database client selected");
  }

  return dbClient;
}
