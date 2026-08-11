import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env/server";
import { publicEnv } from "@/lib/env/public";
import { DatabaseClient, QueryBuilder } from "./types";
import { logger } from "@/lib/logger/logger";

/**
 * Builds a Supabase-backed DatabaseClient, validating the required environment
 * variables. This is intentionally NOT run at module load: the app selects its
 * database client at runtime (Postgres in production, Supabase in dev), so
 * constructing/validating Supabase eagerly would crash production where the
 * Supabase env vars are absent. Call this only when Supabase is the chosen client.
 */
export function createSupabaseClient(): DatabaseClient {
  const supabaseUrl = publicEnv.supabaseUrl;
  const serviceRoleKey = serverEnv.supabase.serviceRoleKey ?? serverEnv.supabase.serviceKey;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }

  if (!serviceRoleKey) {
    const missingKeys = [];

    if (!serverEnv.supabase.serviceRoleKey) {
      missingKeys.push("SUPABASE_SERVICE_ROLE_KEY");
    }
    if (!serverEnv.supabase.serviceKey) {
      missingKeys.push("SUPABASE_SERVICE_KEY");
    }
    throw new Error(
      `Neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_SERVICE_KEY is set (server-side admin access requires one of them). Missing: ${missingKeys.join(", ")}`,
    );
  }

  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  logger.info("Supabase database client initialized");

  return {
    from: <T = any>(table: string) => client.from(table) as unknown as QueryBuilder<T>,
    rpc: (functionName: string, args?: Record<string, any>) => client.rpc(functionName, args) as any,
  };
}

let cachedClient: DatabaseClient | null = null;

/**
 * Returns a memoized Supabase DatabaseClient, constructing it (and validating
 * env vars) on first use.
 */
export function getSupabaseClient(): DatabaseClient {
  if (!cachedClient) {
    cachedClient = createSupabaseClient();
  }

  return cachedClient;
}
