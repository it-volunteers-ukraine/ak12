import { SESSION_COOKIE_NAME, SESSION_TTL, SESSION_INACTIVITY_TTL, SESSION_REFRESH_DEBOUNCE_MS } from "@/constants";

const cookieStore = {
  set: jest.fn(),
  delete: jest.fn(),
  get: jest.fn(),
};

jest.mock("next/headers", () => ({
  cookies: jest.fn(async () => cookieStore),
}));

const bcryptCompare = jest.fn();

jest.mock("bcryptjs", () => ({
  compare: (...args: unknown[]) => bcryptCompare(...args),
}));

jest.mock("otplib", () => ({
  authenticator: {
    generate: jest.fn(),
  },
}));

const TEST_SECRET = "a".repeat(32);

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  process.env = { ...ORIGINAL_ENV, SESSION_SECRET_KEY: TEST_SECRET };
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

const loadService = () => require("./session.service") as typeof import("./session.service");

describe("session.service", () => {
  describe("generateSessionToken + getSessionPayload", () => {
    it("should round-trip a token and recover the admin payload", () => {
      const { generateSessionToken, getSessionPayload } = loadService();
      const token = generateSessionToken();
      const payload = getSessionPayload(token);

      expect(payload).not.toBeNull();
      expect(payload!.user).toBe("admin");
      expect(typeof payload!.lastActivityAt).toBe("number");
      expect(payload!.lastActivityAt).toBeLessThanOrEqual(Date.now());
    });

    it("should produce a token with payload.signature structure", () => {
      const { generateSessionToken } = loadService();
      const token = generateSessionToken();
      const dotIndex = token.lastIndexOf(".");

      expect(dotIndex).toBeGreaterThan(0);
      expect(token.slice(dotIndex + 1)).toMatch(/^[a-f0-9]{64}$/);
    });

    it.each([
      ["undefined", undefined],
      ["missing the signature delimiter", "no-dot-here"],
    ])("should return null when the token is %s", (_label, token) => {
      const { getSessionPayload } = loadService();

      expect(getSessionPayload(token)).toBeNull();
    });

    it("should return null when the signature is tampered with", () => {
      const { generateSessionToken, getSessionPayload } = loadService();
      const token = generateSessionToken();
      const tampered = `${token.slice(0, -1)}${token.slice(-1) === "a" ? "b" : "a"}`;

      expect(getSessionPayload(tampered)).toBeNull();
    });

    it("should return null when the secret used to verify differs from the secret used to sign", () => {
      const { generateSessionToken } = loadService();
      const token = generateSessionToken();

      jest.resetModules();
      process.env.SESSION_SECRET_KEY = "b".repeat(32);
      const { getSessionPayload: getWithOtherSecret } = loadService();

      expect(getWithOtherSecret(token)).toBeNull();
    });

    it("should return null for invalid base64 payload", () => {
      const { getSessionPayload } = loadService();

      const invalidPayload = Buffer.from("not-json").toString("base64");
      const token = `${invalidPayload}.123`;

      expect(getSessionPayload(token)).toBeNull();
    });

    it("should throw when SESSION_SECRET_KEY is missing", () => {
      jest.resetModules();

      const original = process.env.SESSION_SECRET_KEY;

      delete process.env.SESSION_SECRET_KEY;

      const { generateSessionToken } = loadService();

      expect(() => generateSessionToken()).toThrow("SESSION_SECRET_KEY environment variable is missing or too short");

      process.env.SESSION_SECRET_KEY = original;
    });

    it("should return null when signature length differs", () => {
      const { generateSessionToken, getSessionPayload } = loadService();

      const token = generateSessionToken();
      const [payload] = token.split(".");

      const expectedLength = generateSessionToken().split(".")[1].length;

      const badSignature = "a".repeat(expectedLength - 1);

      const badToken = `${payload}.${badSignature}`;

      expect(getSessionPayload(badToken)).toBeNull();
    });

    it("should return null when payload or signature is empty string", () => {
      const { getSessionPayload } = loadService();

      const token = ".";

      expect(getSessionPayload(token)).toBeNull();
    });

    it("should return null when user is invalid", () => {
      const { getSessionPayload } = loadService();

      const badPayload = Buffer.from(JSON.stringify({ user: "hacker", lastActivityAt: Date.now() })).toString("base64");

      const token = `${badPayload}.` + "a".repeat(64);

      expect(getSessionPayload(token)).toBeNull();
    });

    it("should return null when lastActivityAt is not a number", () => {
      const { getSessionPayload } = loadService();

      const badPayload = Buffer.from(JSON.stringify({ user: "admin", lastActivityAt: "not-a-number" })).toString(
        "base64",
      );

      const token = `${badPayload}.` + "a".repeat(64);

      expect(getSessionPayload(token)).toBeNull();
    });

    it("should return null when payload is corrupted JSON", () => {
      const { getSessionPayload } = loadService();

      const invalidJson = Buffer.from("{not-json").toString("base64");

      const token = `${invalidJson}.` + "a".repeat(64);

      expect(getSessionPayload(token)).toBeNull();
    });

    it("should return null when user is not admin", () => {
      const { getSessionPayload } = loadService();

      const payload = Buffer.from(
        JSON.stringify({
          user: "hacker",
          lastActivityAt: Date.now(),
        }),
      ).toString("base64");

      const token = `${payload}.${"a".repeat(64)}`;

      expect(getSessionPayload(token)).toBeNull();
    });
  });

  describe("verifySession", () => {
    it("should return true for a freshly generated token", () => {
      const { generateSessionToken, verifySession } = loadService();

      expect(verifySession(generateSessionToken())).toBe(true);
    });

    it("should return false when the token is missing", () => {
      const { verifySession } = loadService();

      expect(verifySession(undefined)).toBe(false);
    });

    it("should return false when lastActivityAt is older than the inactivity window", () => {
      const { generateSessionToken, verifySession } = loadService();

      const realNow = Date.now;

      Date.now = () => realNow.call(Date) - (SESSION_INACTIVITY_TTL + 60) * 1000;
      const oldToken = generateSessionToken();

      Date.now = realNow;
      expect(verifySession(oldToken)).toBe(false);
    });
  });

  describe("shouldRefreshSession", () => {
    it.each([
      ["older than the debounce window", 5 * 60 * 1000, true],
      ["within the debounce window", 0, false],
    ])("should return %s when last activity is %s", (_label, ageMs, expected) => {
      const { shouldRefreshSession } = loadService();

      expect(shouldRefreshSession(Date.now() - ageMs)).toBe(expected);
    });

    it("should return false exactly on debounce threshold boundary", () => {
      const { shouldRefreshSession } = loadService();

      const now = Date.now();

      expect(shouldRefreshSession(now - SESSION_REFRESH_DEBOUNCE_MS)).toBe(false);
    });
  });

  describe("getSessionCookieOptions", () => {
    it("should mark the cookie httpOnly, sameSite=strict and path=/", () => {
      const { getSessionCookieOptions } = loadService();
      const options = getSessionCookieOptions(SESSION_TTL);

      expect(options).toEqual({
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: SESSION_TTL,
        path: "/",
      });
    });

    it("should set secure=true in production", () => {
      // @ts-ignore
      process.env.NODE_ENV = "production";
      const { getSessionCookieOptions } = loadService();

      expect(getSessionCookieOptions(SESSION_TTL).secure).toBe(true);
    });
  });

  describe("createSession", () => {
    it("should write a signed token under the session cookie name with the session TTL", async () => {
      const { createSession } = loadService();

      await createSession();

      expect(cookieStore.set).toHaveBeenCalledTimes(1);
      const [name, token, options] = cookieStore.set.mock.calls[0];

      expect(name).toBe(SESSION_COOKIE_NAME);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBeGreaterThanOrEqual(2);
      expect(options).toEqual(
        expect.objectContaining({
          httpOnly: true,
          sameSite: "strict",
          maxAge: SESSION_TTL,
          path: "/",
        }),
      );
    });

    it("should throw when creating session fails", async () => {
      cookieStore.set.mockImplementationOnce(() => {
        throw new Error("Cookie store write failed");
      });

      const { createSession } = loadService();

      await expect(createSession()).rejects.toThrow("Cookie store write failed");
    });

    it("should wrap non-Error thrown values in generic message", async () => {
      cookieStore.set.mockImplementationOnce(() => {
        throw "string error";
      });

      const { createSession } = loadService();

      await expect(createSession()).rejects.toThrow("Failed to create session");
    });
  });

  describe("deleteSession", () => {
    it("should delete the session cookie", async () => {
      const { deleteSession } = loadService();

      await deleteSession();

      expect(cookieStore.delete).toHaveBeenCalledWith(SESSION_COOKIE_NAME);
    });

    it("should throw when deleting session cookie fails", async () => {
      cookieStore.delete.mockImplementationOnce(() => {
        throw new Error("Failed to delete session cookie");
      });

      const { deleteSession } = loadService();

      await expect(deleteSession()).rejects.toThrow("Failed to delete session cookie");
    });

    it("should wrap non-Error thrown values in generic message", async () => {
      cookieStore.delete.mockImplementationOnce(() => {
        throw "string error";
      });

      const { deleteSession } = loadService();

      await expect(deleteSession()).rejects.toThrow("Failed to delete session");
    });
  });

  describe("validateAdmin", () => {
    it("should return true when email matches and bcrypt verifies the password", async () => {
      process.env.ADMIN_EMAIL = "admin@example.com";
      process.env.ADMIN_PASSWORD_HASH = "$2a$10$hash";
      bcryptCompare.mockResolvedValue(true);

      const { validateAdmin } = loadService();
      const result = await validateAdmin("admin@example.com", "correct-horse-battery-staple");

      expect(result).toBe(true);
      expect(bcryptCompare).toHaveBeenCalledWith("correct-horse-battery-staple", "$2a$10$hash");
    });

    it("should return false when bcrypt rejects the password", async () => {
      process.env.ADMIN_EMAIL = "admin@example.com";
      process.env.ADMIN_PASSWORD_HASH = "$2a$10$hash";
      bcryptCompare.mockResolvedValue(false);

      const { validateAdmin } = loadService();

      expect(await validateAdmin("admin@example.com", "wrong")).toBe(false);
    });

    it("should return false when the email does not match the configured admin", async () => {
      process.env.ADMIN_EMAIL = "admin@example.com";
      process.env.ADMIN_PASSWORD_HASH = "$2a$10$hash";
      bcryptCompare.mockResolvedValue(true);

      const { validateAdmin } = loadService();

      expect(await validateAdmin("someone@else.com", "correct-horse-battery-staple")).toBe(false);
    });

    it("should return false when ADMIN_EMAIL is not configured", async () => {
      delete process.env.ADMIN_EMAIL;
      process.env.ADMIN_PASSWORD_HASH = "$2a$10$hash";

      const { validateAdmin } = loadService();

      expect(await validateAdmin("admin@example.com", "pw")).toBe(false);
      expect(bcryptCompare).not.toHaveBeenCalled();
    });

    it("should return false when ADMIN_PASSWORD_HASH is not configured", async () => {
      process.env.ADMIN_EMAIL = "admin@example.com";
      delete process.env.ADMIN_PASSWORD_HASH;

      const { validateAdmin } = loadService();

      expect(await validateAdmin("admin@example.com", "pw")).toBe(false);
      expect(bcryptCompare).not.toHaveBeenCalled();
    });
  });

  describe("validateTwoFactor", () => {
    const setup = () => {
      process.env.ADMIN_2FA_SECRET = "secret";

      jest.resetModules();

      const { authenticator } = require("otplib");
      const { validateTwoFactor } = require("./session.service");

      return { authenticator, validateTwoFactor };
    };

    it("should return true for a valid code", () => {
      const { authenticator, validateTwoFactor } = setup();

      authenticator.generate.mockReturnValue("123456");

      expect(validateTwoFactor("123456")).toBe(true);
    });

    it("should trim user input", () => {
      const { authenticator, validateTwoFactor } = setup();

      authenticator.generate.mockReturnValue("123456");

      expect(validateTwoFactor(" 123456 ")).toBe(true);
    });

    it("should return false for invalid code", () => {
      const { authenticator, validateTwoFactor } = setup();

      authenticator.generate.mockReturnValue("654321");

      expect(validateTwoFactor("123456")).toBe(false);
    });

    it("should return false when secret is missing", () => {
      delete process.env.ADMIN_2FA_SECRET;

      const { validateTwoFactor } = loadService();

      expect(validateTwoFactor("123456")).toBe(false);
    });

    it("should return false when secret is empty string", () => {
      process.env.ADMIN_2FA_SECRET = "";

      const { validateTwoFactor } = loadService();

      expect(validateTwoFactor("123456")).toBe(false);
    });

    it("should return false when otplib throws", () => {
      const { authenticator, validateTwoFactor } = setup();

      authenticator.generate.mockImplementation(() => {
        throw new Error();
      });

      expect(validateTwoFactor("123456")).toBe(false);
    });

    it("should handle whitespace-only input safely", () => {
      const { authenticator, validateTwoFactor } = setup();

      authenticator.generate.mockReturnValue("123456");

      expect(validateTwoFactor("   123456   ")).toBe(true);
    });
  });
});
