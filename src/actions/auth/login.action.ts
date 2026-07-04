"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import type { FieldErrors, State } from "@/types";
import { loginSchema } from "@/schemas";
import { createSession, validateAdmin, validateTwoFactor } from "@/lib/auth/session.service";

export async function adminLogin(_prevState: State, formData: FormData): Promise<State> {
  const data = {
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  };

  const locale = String(formData.get("locale") || "uk");
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    const fieldErrors: FieldErrors = {
      email: tree.properties?.email?.errors ?? [],
      password: tree.properties?.password?.errors ?? [],
    };

    return {
      fieldErrors,
      error: "",
    };
  }

  const isValid = await validateAdmin(data.email, data.password);

  if (!isValid) {
    return {
      fieldErrors: {
        password: ["Невірний email або пароль"],
      },
      error: "",
    };
  }

  return {
    fieldErrors: {},
    error: "",
    needsTwoFactor: true,
    locale,
  };
}

export async function verifyTwoFactor(_prevState: State, formData: FormData): Promise<State> {
  const code = String(formData.get("code"));
  const locale = String(formData.get("locale") || "uk");

  if (!/^\d{6}$/.test(code)) {
    return {
      fieldErrors: { code: ["Введіть 6-значний код"] },
      error: "",
      needsTwoFactor: true,
      locale,
    };
  }

  const isValid = validateTwoFactor(code);

  if (!isValid) {
    return {
      fieldErrors: { code: ["Невірний код"] },
      error: "",
      needsTwoFactor: true,
      locale,
    };
  }

  await createSession();

  redirect(`/${locale}/admin`);
}
