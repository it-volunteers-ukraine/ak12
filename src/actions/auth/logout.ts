"use server";

import { deleteSession } from "@/lib/auth/session.service";
import { redirect } from "next/navigation";

export async function logout(formData: FormData) {
  const locale = String(formData.get("locale") || "uk");

  await deleteSession();
  redirect(`/${locale}`);
}
