import "server-only";

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
      return process.env.SESSION_SECRET_KEY;
    },
    get adminEmail() {
      return process.env.ADMIN_EMAIL;
    },
    get adminPasswordHash() {
      return process.env.ADMIN_PASSWORD_HASH;
    },
    get admin2faSecret() {
      return process.env.ADMIN_2FA_SECRET;
    },
  },
  postgres: {
    get user() {
      return process.env.POSTGRES_USER;
    },
    get password() {
      return process.env.POSTGRES_PASSWORD;
    },
    get host() {
      return process.env.POSTGRES_HOST;
    },
    get port() {
      return process.env.POSTGRES_PORT;
    },
    get database() {
      return process.env.POSTGRES_DB;
    },
  },
  supabase: {
    get serviceRoleKey() {
      return process.env.SUPABASE_SERVICE_ROLE_KEY;
    },
    get serviceKey() {
      return process.env.SUPABASE_SERVICE_KEY;
    },
  },
  // CLOUDINARY_CLOUD_NAME is public in value but is NOT NEXT_PUBLIC_-prefixed, so it is
  // only usable server-side; it lives here with the other Cloudinary vars. If it is ever
  // needed in the browser, rename it with the NEXT_PUBLIC_ prefix and move it to public.ts.
  cloudinary: {
    get cloudName() {
      return process.env.CLOUDINARY_CLOUD_NAME;
    },
    get apiKey() {
      return process.env.CLOUDINARY_API_KEY;
    },
    get apiSecret() {
      return process.env.CLOUDINARY_API_SECRET;
    },
    get mediaFolder() {
      return process.env.CLOUDINARY_MEDIA_FOLDER;
    },
  },
  storage: {
    get client() {
      return process.env.STORAGE_CLIENT;
    },

    get endpoint() {
      return process.env.STORAGE_ENDPOINT;
    },

    get bucket() {
      return process.env.STORAGE_BUCKET;
    },

    get accessKey() {
      return process.env.STORAGE_ACCESS_KEY;
    },

    get secretKey() {
      return process.env.STORAGE_SECRET_KEY;
    },

    get mediaFolder() {
      return process.env.STORAGE_MEDIA_FOLDER;
    },
    get region() {
      return process.env.STORAGE_REGION;
    },
  },
} as const;
