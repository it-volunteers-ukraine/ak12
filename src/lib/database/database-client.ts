import { getDbClient } from "@/lib/db";

// NOTE: This is the main database client used throughout the app
// In DEV: uses Supabase (cloud)
// In PROD: uses PostgreSQL (local)
// See src/lib/db/index.ts for the abstraction layer

export const databaseClient = getDbClient();
