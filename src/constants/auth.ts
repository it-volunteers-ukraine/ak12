export const SESSION_COOKIE_NAME = "admin_session";

// Absolute session lifetime (cookie expiration)
export const SESSION_TTL = 60 * 15; // 15 minutes

// Inactivity timeout must be <= SESSION_TTL
export const SESSION_INACTIVITY_TTL = 60 * 10; // 10 minutes

// Internal config validation (fail fast on invalid setup)
function validateSessionConfig() {
  if (SESSION_INACTIVITY_TTL > SESSION_TTL) {
    throw new Error("SESSION_INACTIVITY_TTL cannot exceed SESSION_TTL");
  }
}

validateSessionConfig();
