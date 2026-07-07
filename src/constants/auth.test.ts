import {
  SESSION_TTL,
  SESSION_INACTIVITY_TTL,
  SESSION_REFRESH_DEBOUNCE_MS,
  validateSessionConfig,
} from "@/constants/auth";

const makeValidConfig = () => ({
  SESSION_TTL: 1000,
  SESSION_INACTIVITY_TTL: 600,
  SESSION_REFRESH_DEBOUNCE_MS: 1000,
});

const makeInvalidInactivityConfig = () => ({
  SESSION_TTL: 600,
  SESSION_INACTIVITY_TTL: 900,
  SESSION_REFRESH_DEBOUNCE_MS: 1000,
});

const makeInvalidDebounceConfig = () => ({
  SESSION_TTL: 1000,
  SESSION_INACTIVITY_TTL: 900,
  SESSION_REFRESH_DEBOUNCE_MS: 900000,
});

describe("session-config", () => {
  it("validateSessionConfig does not throw for valid config", () => {
    expect(() => validateSessionConfig(makeValidConfig())).not.toThrow();
  });

  it("throws when inactivity TTL is greater than session TTL", () => {
    expect(() => validateSessionConfig(makeInvalidInactivityConfig())).toThrow(
      "SESSION_INACTIVITY_TTL must be less than or equal to SESSION_TTL",
    );
  });

  it("throws when debounce is too large", () => {
    expect(() => validateSessionConfig(makeInvalidDebounceConfig())).toThrow(
      "SESSION_REFRESH_DEBOUNCE_MS must be less than SESSION_INACTIVITY_TTL",
    );
  });

  it("current constants are valid", () => {
    expect(SESSION_INACTIVITY_TTL).toBeLessThanOrEqual(SESSION_TTL);

    expect(SESSION_REFRESH_DEBOUNCE_MS).toBeLessThan(SESSION_INACTIVITY_TTL * 1000);
  });
});
