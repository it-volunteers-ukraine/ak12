import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "./constants";
import { verifySession } from "@/lib/auth/session.service";
import { SESSION_COOKIE_NAME } from "@/constants";

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
        secure: true,
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      });
    }

    return response;
  }

  const response = intlMiddleware(request);

  if (token && !isValid) {
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: true,
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
