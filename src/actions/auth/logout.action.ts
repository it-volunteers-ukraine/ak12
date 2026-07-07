"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/auth/session.service";

export async function logout(formData: FormData) {
  const locale = String(formData.get("locale") || "uk");

  await deleteSession();
  redirect(`/${locale}`);
}
