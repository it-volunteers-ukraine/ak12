import {
  SESSION_COOKIE_NAME,
  SESSION_TTL,
  SESSION_INACTIVITY_TTL,
  SESSION_REFRESH_DEBOUNCE_MS,
  validateSessionConfig,
} from "./auth";

describe("session-config", () => {
  it("exports correct constants", () => {
    expect(SESSION_COOKIE_NAME).toBe("admin_session");
    expect(SESSION_TTL).toBe(900);
    expect(SESSION_INACTIVITY_TTL).toBe(600);
    expect(SESSION_REFRESH_DEBOUNCE_MS).toBe(60000);
  });

  it("validateSessionConfig does not throw for valid config", () => {
    expect(() => validateSessionConfig()).not.toThrow();
  });
});
