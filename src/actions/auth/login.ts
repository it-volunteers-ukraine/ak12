"use server";

import { createSession, validateAdmin } from "@/lib/auth/session.service";
import { loginSchema } from "@/schemas";
import { redirect } from "next/navigation";
import type { FieldErrors, State } from "@/types";
import { z } from "zod";

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

  await createSession();

  redirect(`/${locale}/admin`);

  return {
    error: "",
    fieldErrors: {},
  };
}
