import "server-only";

// Use an indirect lookup so Next.js does not replace individual environment
// references with build-time values. These secrets must be read by the Node
// process when the container starts.
function runtimeEnv(name: string): string | undefined {
  return process.env[name];
}

/**
 * Canonical catalog of every server-side environment variable (secrets and
 * backend config). This is the single place to audit what secrets the app reads.
 *
 * The `import "server-only"` above turns any attempt to import this module from a
 * Client Component into a BUILD ERROR, so a secret can never leak into the browser
 * bundle. Only NEXT_PUBLIC_-prefixed values belong in `./public.ts` instead.
 *
 * Each field is a getter that reads `process.env` live on every access, so presence
 * checks and validation stay at the call sites (e.g. the auth and DB clients decide
 * for themselves whether a missing value should throw or soft-fail).
 */
export const serverEnv = {
  auth: {
    get sessionSecretKey() {
      return runtimeEnv("SESSION_SECRET_KEY");
    },
    get adminEmail() {
      return runtimeEnv("ADMIN_EMAIL");
    },
    get adminPasswordHash() {
      return runtimeEnv("ADMIN_PASSWORD_HASH");
    },
    get admin2faSecret() {
      return runtimeEnv("ADMIN_2FA_SECRET");
    },
  },
  postgres: {
    get user() {
      return runtimeEnv("POSTGRES_USER");
    },
    get password() {
      return runtimeEnv("POSTGRES_PASSWORD");
    },
    get host() {
      return runtimeEnv("POSTGRES_HOST");
    },
    get port() {
      return runtimeEnv("POSTGRES_PORT");
    },
    get database() {
      return runtimeEnv("POSTGRES_DB");
    },
  },
  supabase: {
    get serviceRoleKey() {
      return runtimeEnv("SUPABASE_SERVICE_ROLE_KEY");
    },
    get serviceKey() {
      return runtimeEnv("SUPABASE_SERVICE_KEY");
    },
  },
  // CLOUDINARY_CLOUD_NAME is public in value but is NOT NEXT_PUBLIC_-prefixed, so it is
  // only usable server-side; it lives here with the other Cloudinary vars. If it is ever
  // needed in the browser, rename it with the NEXT_PUBLIC_ prefix and move it to public.ts.
  cloudinary: {
    get cloudName() {
      return runtimeEnv("CLOUDINARY_CLOUD_NAME");
    },
    get apiKey() {
      return runtimeEnv("CLOUDINARY_API_KEY");
    },
    get apiSecret() {
      return runtimeEnv("CLOUDINARY_API_SECRET");
    },
    get mediaFolder() {
      return runtimeEnv("CLOUDINARY_MEDIA_FOLDER");
    },
  },
} as const;
