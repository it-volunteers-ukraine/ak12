import "server-only";

import { createClient } from "@supabase/supabase-js";

if (!serviceRoleKey) {
    const missingKeys = [];
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missingKeys.push('SUPABASE_SERVICE_ROLE_KEY');
    if (!process.env.SUPABASE_SERVICE_KEY) missingKeys.push('SUPABASE_SERVICE_KEY');
    throw new Error(
        `Neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_SERVICE_KEY is set (server-side admin access requires one of them). Missing: ${missingKeys.join(', ')}`,
    );
}
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    ?? process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!serviceRoleKey) {
    throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is not set (server-side admin access requires it)",
    );
}

export const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
