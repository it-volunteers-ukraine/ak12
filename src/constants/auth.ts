export const SESSION_COOKIE_NAME = "admin_session";

// Absolute session lifetime (cookie expiration)
export const SESSION_TTL = 60 * 15; // 15 minutes

// Inactivity timeout must be <= SESSION_TTL
export const SESSION_INACTIVITY_TTL = 60 * 10; // 10 minutes

// Session refresh debounce (how often session can be extended)
export const SESSION_REFRESH_DEBOUNCE_MS = 60 * 1000; // 1 minute

// Internal config validation (fail fast on invalid setup)
export function validateSessionConfig(config?: {
  SESSION_TTL: number;
  SESSION_INACTIVITY_TTL: number;
  SESSION_REFRESH_DEBOUNCE_MS: number;
}) {
  const resolved = config ?? {
    SESSION_TTL,
    SESSION_INACTIVITY_TTL,
    SESSION_REFRESH_DEBOUNCE_MS,
  };

  if (resolved.SESSION_INACTIVITY_TTL > resolved.SESSION_TTL) {
    throw new Error("SESSION_INACTIVITY_TTL must be less than or equal to SESSION_TTL");
  }

  if (resolved.SESSION_REFRESH_DEBOUNCE_MS >= resolved.SESSION_INACTIVITY_TTL * 1000) {
    throw new Error("SESSION_REFRESH_DEBOUNCE_MS must be less than SESSION_INACTIVITY_TTL");
  }
}

validateSessionConfig();
