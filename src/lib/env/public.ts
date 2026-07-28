/**
 * Canonical catalog of the client-safe environment variables.
 *
 * Only NEXT_PUBLIC_-prefixed values belong here — Next.js inlines these into the
 * browser bundle, so they must never hold a secret. Everything sensitive lives in
 * `./server.ts` (guarded by `server-only`). This module is safe to import from any
 * context, server or client.
 *
 * Each field references the full literal `process.env.NEXT_PUBLIC_*` name so Next's
 * build-time replacement can statically substitute it.
 */
export const publicEnv = {
  get supabaseUrl() {
    return process.env.NEXT_PUBLIC_SUPABASE_URL;
  },
} as const;
