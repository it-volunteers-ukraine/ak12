import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, SESSION_INACTIVITY_TTL, SESSION_TTL } from "@/constants";

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
  const payload = JSON.stringify(createSessionPayload());
  const signature = sign(payload);

  return `${payload}.${signature}`;
}

export async function createSession() {
  const token = generateSessionToken();
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_TTL,
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function verifySession(token?: string) {
  if (!token) {
    return false;
  }

  const lastDotIndex = token.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return false;
  }

  const payload = token.slice(0, lastDotIndex);
  const signature = token.slice(lastDotIndex + 1);

  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = sign(payload);

  if (signature !== expectedSignature) {
    return false;
  }

  try {
    const data = JSON.parse(payload) as SessionPayload;
    const isInactive = Date.now() - data.lastActivityAt > SESSION_INACTIVITY_TTL * 1000;

    return !isInactive;
  } catch {
    return false;
  }
}

export async function validateAdmin(email: string, password: string): Promise<boolean> {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedEmail || !expectedPasswordHash) {
    return false;
  }

  return email === expectedEmail && (await bcrypt.compare(password, expectedPasswordHash));
}
