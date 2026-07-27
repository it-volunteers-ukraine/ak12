import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { authenticator } from "otplib";
import { serverEnv } from "@/lib/env/server";
import {
  SESSION_COOKIE_NAME,
  SESSION_INACTIVITY_TTL,
  SESSION_TTL,
  SESSION_REFRESH_DEBOUNCE_MS,
  PRE_AUTH_COOKIE_NAME,
  PRE_AUTH_TTL,
} from "@/constants";

type SessionPayload = {
  user: "admin";
  type: "session" | "pre-auth";
  lastActivityAt: number;
};

authenticator.options = {
  window: 1,
};

function sign(value: string) {
  const secret = serverEnv.auth.sessionSecretKey;

  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET_KEY environment variable is missing or too short. It must be at least 32 characters.",
    );
  }

  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function createSessionPayload(type: SessionPayload["type"]): SessionPayload {
  return {
    user: "admin",
    type,
    lastActivityAt: Date.now(),
  };
}

export function generateSessionToken(type: SessionPayload["type"]) {
  const payload = Buffer.from(JSON.stringify(createSessionPayload(type))).toString("base64");

  return `${payload}.${sign(payload)}`;
}

export function getSessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge,
    path: "/",
  };
}

export async function createSession() {
  try {
    const token = generateSessionToken("session");
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions(SESSION_TTL));
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create session");
  }
}

export async function createPreAuthSession() {
  try {
    const token = generateSessionToken("pre-auth");
    const cookieStore = await cookies();

    cookieStore.set(PRE_AUTH_COOKIE_NAME, token, getSessionCookieOptions(PRE_AUTH_TTL));
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create pre-auth session");
  }
}

export async function deletePreAuthSession() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete(PRE_AUTH_COOKIE_NAME);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete pre-auth session");
  }
}

export async function verifyPreAuthSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(PRE_AUTH_COOKIE_NAME)?.value;
    const payload = getSessionPayload(token);

    if (!payload || payload.type !== "pre-auth") {
      return false;
    }

    return !isSessionExpired(payload.lastActivityAt, PRE_AUTH_TTL);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to verify pre-auth session");
  }
}

export async function deleteSession() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete session");
  }
}

export function getSessionPayload(token?: string): SessionPayload | null {
  if (!token) {
    return null;
  }

  const lastDotIndex = token.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return null;
  }

  const payload = token.slice(0, lastDotIndex);
  const signature = token.slice(lastDotIndex + 1);

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = sign(payload);

  if (signature.length !== expectedSignature.length) {
    return null;
  }

  const isValidSignature = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!isValidSignature) {
    return null;
  }

  try {
    const decodedPayload = Buffer.from(payload, "base64").toString("utf8");
    const data = JSON.parse(decodedPayload) as Partial<SessionPayload>;

    if (
      data.user !== "admin" ||
      (data.type !== "session" && data.type !== "pre-auth") ||
      typeof data.lastActivityAt !== "number"
    ) {
      return null;
    }

    return {
      user: "admin",
      type: data.type,
      lastActivityAt: data.lastActivityAt,
    };
  } catch {
    return null;
  }
}

function isSessionExpired(lastActivityAt: number, ttl: number) {
  return Date.now() - lastActivityAt > ttl * 1000;
}

export function verifySession(token?: string) {
  const data = getSessionPayload(token);

  if (!data || data.type !== "session") {
    return false;
  }

  return !isSessionExpired(data.lastActivityAt, SESSION_INACTIVITY_TTL);
}

export function shouldRefreshSession(lastActivityAt: number) {
  return Date.now() - lastActivityAt > SESSION_REFRESH_DEBOUNCE_MS;
}

export async function validateAdmin(email: string, password: string): Promise<boolean> {
  const expectedEmail = serverEnv.auth.adminEmail;
  const expectedPasswordHash = serverEnv.auth.adminPasswordHash;

  if (!expectedEmail || !expectedPasswordHash) {
    return false;
  }

  return email === expectedEmail && (await bcrypt.compare(password, expectedPasswordHash));
}

export function validateTwoFactor(token: string): boolean {
  const secret = serverEnv.auth.admin2faSecret;

  if (!secret) {
    return false;
  }

  try {
    return authenticator.verify({
      token: token.trim(),
      secret,
    });
  } catch {
    return false;
  }
}
