import createMiddleware from "next-intl/middleware";
import proxy, { buildCsp, config } from "@/proxy";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_TTL } from "@/constants";
import {
  verifySession,
  generateSessionToken,
  getSessionPayload,
  shouldRefreshSession,
  getSessionCookieOptions,
} from "@/lib/auth/session.service";

jest.mock("next-intl/middleware", () => ({
  __esModule: true,
  default: jest.fn(() => {
    return jest.fn(() => ({
      cookies: { set: jest.fn() },
      headers: { set: jest.fn() },
    }));
  }),
}));

jest.mock("next/server", () => ({
  __esModule: true,
  NextResponse: {
    redirect: jest.fn((url: any) => ({
      cookies: { set: jest.fn() },
      headers: { set: jest.fn() },
      redirectedTo: url.toString ? url.toString() : String(url),
    })),
    // NEW: proxy.ts now calls NextResponse.next(...) to forward the nonce
    next: jest.fn((init?: any) => ({
      cookies: { set: jest.fn() },
      headers: { set: jest.fn() },
      ...init,
    })),
  },
}));

jest.mock("@/lib/auth/session.service", () => ({
  verifySession: jest.fn(),
  generateSessionToken: jest.fn(),
  getSessionPayload: jest.fn(),
  shouldRefreshSession: jest.fn(),
  getSessionCookieOptions: jest.fn((ttl: number) => ({
    path: "/",
    httpOnly: true,
    ...(ttl === 0 ? { maxAge: 0 } : { maxAge: ttl * 1000 }),
  })),
}));

const MOCK_COOKIE_OPTIONS = { path: "/", httpOnly: true };

function createMockRequest(pathname: string, url: string, cookieValue: string | undefined) {
  return {
    nextUrl: { pathname },
    url,
    cookies: { get: jest.fn(() => (cookieValue ? { value: cookieValue } : undefined)) },
  };
}

function getHeaderValue(res: any, key: string): string | undefined {
  const call = res.headers.set.mock.calls.find(([headerKey]: [string]) => headerKey === key);

  return call ? call[1] : undefined;
}

function getNonceFromCsp(res: any): string | undefined {
  const csp = getHeaderValue(res, "Content-Security-Policy") ?? "";
  
  return csp.match(/'nonce-([^']+)'/)?.[1];
}

describe("proxy middleware", () => {
  // NEW: capture the inner next-intl middleware mock before it gets cleared by clearAllMocks
  let intlMiddlewareMock: jest.Mock;

  beforeAll(() => {
    intlMiddlewareMock = (createMiddleware as jest.Mock).mock.results[0].value as jest.Mock;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("admin route with invalid session", () => {
    it("redirects to login and clears cookie", () => {
      (verifySession as jest.Mock).mockReturnValue(false);
      (getSessionCookieOptions as jest.Mock).mockReturnValue(MOCK_COOKIE_OPTIONS);

      const res: any = proxy(
        createMockRequest(
          "/uk/management-console-12ak/dashboard",
          "http://localhost/uk/management-console-12ak/dashboard",
          "old-token",
        ) as any,
      );

      expect(NextResponse.redirect).toHaveBeenCalled();
      expect(res.cookies.set).toHaveBeenCalledWith(SESSION_COOKIE_NAME, "", getSessionCookieOptions(0));
    });
  });

  describe("admin route with valid session and refresh needed", () => {
    it("refreshes session cookie", () => {
      (verifySession as jest.Mock).mockReturnValue(true);
      (getSessionPayload as jest.Mock).mockReturnValue({ lastActivityAt: Date.now() - 1000 });
      (shouldRefreshSession as jest.Mock).mockReturnValue(true);
      (generateSessionToken as jest.Mock).mockReturnValue("new-token");
      (getSessionCookieOptions as jest.Mock).mockReturnValue(MOCK_COOKIE_OPTIONS);

      const res: any = proxy(
        createMockRequest(
          "/uk/management-console-12ak/settings",
          "http://localhost/uk/management-console-12ak/settings",
          "token",
        ) as any,
      );

      expect(res.cookies.set).toHaveBeenCalledWith(
        SESSION_COOKIE_NAME,
        "new-token",
        getSessionCookieOptions(SESSION_TTL),
      );
    });
  });

  describe("non-admin route with invalid session", () => {
    it("clears cookie", () => {
      (verifySession as jest.Mock).mockReturnValue(false);
      (getSessionCookieOptions as jest.Mock).mockReturnValue(MOCK_COOKIE_OPTIONS);

      const res: any = proxy(createMockRequest("/uk/home", "http://localhost/uk/home", "some-token") as any);

      expect(res.cookies.set).toHaveBeenCalledWith(SESSION_COOKIE_NAME, "", getSessionCookieOptions(0));
    });
  });

  it("redirects to login without clearing cookie when token is missing", () => {
    (verifySession as jest.Mock).mockReturnValue(false);

    const res: any = proxy(
      createMockRequest(
        "/uk/management-console-12ak/dashboard",
        "http://localhost/uk/management-console-12ak/dashboard",
        undefined,
      ) as any,
    );

    expect(NextResponse.redirect).toHaveBeenCalled();
    expect(res.cookies.set).not.toHaveBeenCalled();
  });

  it("does not refresh session when refresh is not needed", () => {
    (verifySession as jest.Mock).mockReturnValue(true);
    (getSessionPayload as jest.Mock).mockReturnValue({
      lastActivityAt: Date.now(),
    });
    (shouldRefreshSession as jest.Mock).mockReturnValue(false);

    const res: any = proxy(
      createMockRequest(
        "/uk/management-console-12ak/settings",
        "http://localhost/uk/management-console-12ak/settings",
        "token",
      ) as any,
    );

    expect(generateSessionToken).not.toHaveBeenCalled();
    expect(res.cookies.set).not.toHaveBeenCalled();
  });

  it("does not refresh session when payload is missing", () => {
    (verifySession as jest.Mock).mockReturnValue(true);
    (getSessionPayload as jest.Mock).mockReturnValue(null);

    const res: any = proxy(
      createMockRequest(
        "/uk/management-console-12ak/settings",
        "http://localhost/uk/management-console-12ak/settings",
        "token",
      ) as any,
    );

    expect(shouldRefreshSession).not.toHaveBeenCalled();
    expect(generateSessionToken).not.toHaveBeenCalled();
    expect(res.cookies.set).not.toHaveBeenCalled();
  });

  it("does nothing for non-admin route with valid session", () => {
    (verifySession as jest.Mock).mockReturnValue(true);

    const res: any = proxy(createMockRequest("/uk/home", "http://localhost/uk/home", "token") as any);

    expect(generateSessionToken).not.toHaveBeenCalled();
    expect(res.cookies.set).not.toHaveBeenCalled();
  });

  it("does not redirect on login route with invalid session", () => {
    (verifySession as jest.Mock).mockReturnValue(false);

    proxy(createMockRequest("/uk/login", "http://localhost/uk/login", "token") as any);

    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it("should fallback to uk locale when pathname has no locale segment", () => {
    (verifySession as jest.Mock).mockReturnValue(false);

    proxy(createMockRequest("/", "http://localhost/", undefined) as any);

    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it("should expose middleware matcher", () => {
    expect(config.matcher).toEqual(["/((?!api|_next|.*\\..*).*)"]);
  });

  describe("Content-Security-Policy", () => {
    it("sets a CSP header with a nonce on the login redirect response", () => {
      (verifySession as jest.Mock).mockReturnValue(false);

      const res: any = proxy(
        createMockRequest(
          "/uk/management-console-12ak/dashboard",
          "http://localhost/uk/management-console-12ak/dashboard",
          undefined,
        ) as any,
      );

      const csp = getHeaderValue(res, "Content-Security-Policy");

      expect(csp).toBeDefined();
      expect(csp).toMatch(/script-src 'self' 'nonce-[A-Za-z0-9+/=]+' 'strict-dynamic'/);
    });

    it("sets a CSP header with a nonce on the normal (intl) response", () => {
      (verifySession as jest.Mock).mockReturnValue(true);

      const res: any = proxy(createMockRequest("/uk/home", "http://localhost/uk/home", "token") as any);

      const csp = getHeaderValue(res, "Content-Security-Policy");

      expect(csp).toBeDefined();
      expect(csp).toMatch(/script-src 'self' 'nonce-[A-Za-z0-9+/=]+' 'strict-dynamic'/);
    });

    it("does not set x-nonce as a response header, but forwards it to next-intl middleware via request headers", () => {
      (verifySession as jest.Mock).mockReturnValue(true);

      const res: any = proxy(createMockRequest("/uk/home", "http://localhost/uk/home", "token") as any);

      expect(getHeaderValue(res, "x-nonce")).toBeUndefined();

      const nonce = getNonceFromCsp(res);

      expect(nonce).toBeDefined();

      const forwardedRequest = intlMiddlewareMock.mock.calls.at(-1)?.[0];

      expect(forwardedRequest?.request?.headers?.get("x-nonce")).toBe(nonce);
    });

    it("includes required directives for Supabase, Cloudinary, YouTube and Pinterest", () => {
      (verifySession as jest.Mock).mockReturnValue(true);

      const res: any = proxy(createMockRequest("/uk/home", "http://localhost/uk/home", "token") as any);

      const csp = getHeaderValue(res, "Content-Security-Policy") ?? "";

      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("style-src 'self' 'unsafe-inline'");
      expect(csp).toContain("https://res.cloudinary.com");
      expect(csp).toContain("https://img.youtube.com");
      expect(csp).toContain("https://i.pinimg.com");
      expect(csp).toContain("https://ptregtvplvjeoszspvgm.supabase.co");
      expect(csp).toContain("wss://ptregtvplvjeoszspvgm.supabase.co");
      expect(csp).toContain("frame-src https://www.youtube.com");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain("upgrade-insecure-requests");
    });

    it("generates a different nonce on each request", () => {
      (verifySession as jest.Mock).mockReturnValue(true);

      const res1: any = proxy(createMockRequest("/uk/home", "http://localhost/uk/home", "token") as any);
      const res2: any = proxy(createMockRequest("/uk/home", "http://localhost/uk/home", "token") as any);

      const nonce1 = getNonceFromCsp(res1);
      const nonce2 = getNonceFromCsp(res2);

      expect(nonce1).toBeDefined();
      expect(nonce1).not.toEqual(nonce2);
    });
  });

  describe("buildCsp", () => {
    it("includes 'unsafe-eval' in script-src when isDev is true", () => {
      const csp = buildCsp("test-nonce", true);

      expect(csp).toContain("script-src 'self' 'nonce-test-nonce' 'strict-dynamic' 'unsafe-eval'");
    });

    it("never includes 'unsafe-eval' in script-src when isDev is false", () => {
      const csp = buildCsp("test-nonce", false);

      expect(csp).not.toContain("unsafe-eval");
      expect(csp).toContain("script-src 'self' 'nonce-test-nonce' 'strict-dynamic';");
    });

    it("does not include upgrade-insecure-requests when isDev is true", () => {
      const csp = buildCsp("test-nonce", true);

      expect(csp).not.toContain("upgrade-insecure-requests");
    });

    it("includes upgrade-insecure-requests when isDev is false", () => {
      const csp = buildCsp("test-nonce", false);

      expect(csp).toContain("upgrade-insecure-requests");
    });
  });
});