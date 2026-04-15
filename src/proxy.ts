import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "./constants";
import { verifySession, generateSessionToken } from "@/lib/auth/session.service";
import { SESSION_COOKIE_NAME, SESSION_TTL } from "@/constants";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "uk",
  localePrefix: "always",
});

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split("/")[1] || "uk";
  const isAdminRoute = /^\/(uk|en)\/admin/.test(pathname);
  const isLoginRoute = /^\/(uk|en)\/login/.test(pathname);
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isValid = verifySession(token);

  if (isAdminRoute && !isValid && !isLoginRoute) {
    const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));

    if (token) {
      response.cookies.set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      });
    }

    return response;
  }

  const response = intlMiddleware(request);

  if (isAdminRoute && isValid) {
    const refreshedToken = generateSessionToken();

    response.cookies.set(SESSION_COOKIE_NAME, refreshedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_TTL,
      path: "/",
    });
  }

  if (token && !isValid) {
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
