import crypto from "crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, SESSION_TTL } from "@/constants";

function sign(value: string) {
  const secret = process.env.SESSION_SECRET!;

  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export async function createSession() {
  const payload = JSON.stringify({
    user: "admin",
    createdAt: Date.now(),
  });
  const signature = sign(payload);
  const token = `${payload}.${signature}`;
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
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

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  const expected = sign(payload);

  if (signature !== expected) {
    return false;
  }

  try {
    const data = JSON.parse(payload);
    const isExpired = Date.now() - data.createdAt > SESSION_TTL * 1000;

    if (isExpired) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function validateAdmin(email: string, password: string) {
  return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
}
