import proxy, { config } from "@/proxy";
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
    return jest.fn(() => ({ cookies: { set: jest.fn() } }));
  }),
}));

jest.mock("next/server", () => ({
  __esModule: true,
  NextResponse: {
    redirect: jest.fn((url: any) => ({
      cookies: { set: jest.fn() },
      redirectedTo: url.toString ? url.toString() : String(url),
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

describe("proxy middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("admin route with invalid session", () => {
    it("redirects to login and clears cookie", () => {
      (verifySession as jest.Mock).mockReturnValue(false);
      (getSessionCookieOptions as jest.Mock).mockReturnValue(MOCK_COOKIE_OPTIONS);

      const res: any = proxy(
        createMockRequest("/uk/admin/dashboard", "http://localhost/uk/admin/dashboard", "old-token") as any,
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
        createMockRequest("/uk/admin/settings", "http://localhost/uk/admin/settings", "token") as any,
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
      createMockRequest("/uk/admin/dashboard", "http://localhost/uk/admin/dashboard", undefined) as any,
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
      createMockRequest("/uk/admin/settings", "http://localhost/uk/admin/settings", "token") as any,
    );

    expect(generateSessionToken).not.toHaveBeenCalled();
    expect(res.cookies.set).not.toHaveBeenCalled();
  });

  it("does not refresh session when payload is missing", () => {
    (verifySession as jest.Mock).mockReturnValue(true);
    (getSessionPayload as jest.Mock).mockReturnValue(null);

    const res: any = proxy(
      createMockRequest("/uk/admin/settings", "http://localhost/uk/admin/settings", "token") as any,
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
});
