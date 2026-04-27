import { createClient } from "@supabase/supabase-js";

// NOTE: Removed "server-only" import due to build conflicts
// This file should ONLY be imported in server-side code (actions, server components)
// Importing on client will fail naturally due to missing env variables

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!serviceRoleKey) {
  const missingKeys = [];

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    missingKeys.push("SUPABASE_SERVICE_ROLE_KEY");
  }
  if (!process.env.SUPABASE_SERVICE_KEY) {
    missingKeys.push("SUPABASE_SERVICE_KEY");
  }
  throw new Error(
    `Neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_SERVICE_KEY is set (server-side admin access requires one of them). Missing: ${missingKeys.join(", ")}`,
  );
}

export const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
