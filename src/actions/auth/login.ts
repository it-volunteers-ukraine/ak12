"use server";

import { createSession, validateAdmin } from "@/lib/auth/session.service";
import { loginSchema } from "@/schemas";
import { redirect } from "next/navigation";

export async function adminLogin(formData: FormData) {
  const data = {
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  };

  const locale = String(formData.get("locale") || "uk");
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Validation failed" };
  }

  const isValid = validateAdmin(data.email, data.password);

  if (!isValid) {
    return { error: "Invalid credentials" };
  }

  await createSession();

  redirect(`/${locale}/admin`);
}
