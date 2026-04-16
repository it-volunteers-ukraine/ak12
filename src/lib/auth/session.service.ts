import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, SESSION_INACTIVITY_TTL, SESSION_TTL, SESSION_REFRESH_DEBOUNCE_MS } from "@/constants";

type SessionPayload = {
  user: "admin";
  lastActivityAt: number;
};

function sign(value: string) {
  const secret = process.env.SESSION_SECRET_KEY;

  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET_KEY environment variable is missing or too short. It must be at least 32 characters.",
    );
  }

  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function createSessionPayload(): SessionPayload {
  return {
    user: "admin",
    lastActivityAt: Date.now(),
  };
}

export function generateSessionToken() {
  const payload = Buffer.from(JSON.stringify(createSessionPayload())).toString("base64");
  const signature = sign(payload);

  return `${payload}.${signature}`;
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
    const token = generateSessionToken();
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions(SESSION_TTL));
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create session");
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

    if (data.user !== "admin" || typeof data.lastActivityAt !== "number") {
      return null;
    }

    return {
      user: "admin",
      lastActivityAt: data.lastActivityAt,
    };
  } catch {
    return null;
  }
}

export function verifySession(token?: string) {
  const data = getSessionPayload(token);

  if (!data) {
    return false;
  }

  const isInactive = Date.now() - data.lastActivityAt > SESSION_INACTIVITY_TTL * 1000;

  return !isInactive;
}

export function shouldRefreshSession(lastActivityAt: number) {
  return Date.now() - lastActivityAt > SESSION_REFRESH_DEBOUNCE_MS;
}

export async function validateAdmin(email: string, password: string): Promise<boolean> {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedEmail || !expectedPasswordHash) {
    return false;
  }

  return email === expectedEmail && (await bcrypt.compare(password, expectedPasswordHash));
}
