import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, SESSION_COOKIE_NAME, SESSION_TTL } from "@/constants";
import {
  verifySession,
  generateSessionToken,
  getSessionPayload,
  shouldRefreshSession,
  getSessionCookieOptions,
} from "@/lib/auth/session.service";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "uk",
  localePrefix: "always",
});

export function buildCsp(nonce: string, isDev: boolean): string {
  // React/Next.js Fast Refresh потребує eval() лише в dev-режимі.
  // У проді 'unsafe-eval' НІКОЛИ не додається.
const scriptSrc = isDev
  ? `script-src 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval';`
  : `script-src 'nonce-${nonce}' 'strict-dynamic';`;

  // upgrade-insecure-requests примушує браузер підміняти http:// на https://.
  // Локальний dev-сервер працює тільки по HTTP, тому в dev ця директива
  // ламає внутрішні запити (RSC payload, server actions) з ERR_SSL_PROTOCOL_ERROR.
  const upgradeInsecureRequests = isDev ? "" : "upgrade-insecure-requests;";

  return `
    default-src 'self';
    ${scriptSrc}
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://res.cloudinary.com https://img.youtube.com https://i.pinimg.com https://ptregtvplvjeoszspvgm.supabase.co;
    font-src 'self';
    connect-src 'self' https://ptregtvplvjeoszspvgm.supabase.co wss://ptregtvplvjeoszspvgm.supabase.co;
    frame-src https://www.youtube.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${upgradeInsecureRequests}
  `
    .replace(/\s{2,}/g, " ")
    .trim();
}

function applyCsp(response: NextResponse, nonce: string): NextResponse {
  const isDev = process.env.NODE_ENV === "development";

  response.headers.set("Content-Security-Policy", buildCsp(nonce, isDev));

if (process.env.NODE_ENV === "development") {
  response.headers.set("x-nonce", nonce);
}
  
  return response;
}

export default function proxy(request: NextRequest) {
const nonce = crypto.randomBytes(16).toString("base64");

  const { pathname } = request.nextUrl;
  const locale = pathname.split("/")[1] || "uk";
  const isAdminRoute = /^\/(uk|en)\/management-console-12ak/.test(pathname);
  const isLoginRoute = /^\/(uk|en)\/login/.test(pathname);
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isValid = verifySession(token);

  if (isAdminRoute && !isValid && !isLoginRoute) {
    const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));

    if (token) {
      response.cookies.set(SESSION_COOKIE_NAME, "", getSessionCookieOptions(0));
    }

    return applyCsp(response, nonce);
  }

  const response = intlMiddleware(request);

  if (isAdminRoute && isValid && token) {
    const sessionPayload = getSessionPayload(token);

    if (sessionPayload && shouldRefreshSession(sessionPayload.lastActivityAt)) {
      const refreshedToken = generateSessionToken();

      response.cookies.set(SESSION_COOKIE_NAME, refreshedToken, getSessionCookieOptions(SESSION_TTL));
    }
  }

  if (token && !isValid) {
    response.cookies.set(SESSION_COOKIE_NAME, "", getSessionCookieOptions(0));
  }

  return applyCsp(response, nonce);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};