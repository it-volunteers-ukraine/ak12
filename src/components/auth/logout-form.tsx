"use client";

import { useParams } from "next/navigation";
import { logout } from "@/actions/auth/logout";

export function LogoutForm() {
  const params = useParams();
  const locale = params.locale as string;

  async function action(formData: FormData) {
    formData.append("locale", locale);
    await logout(formData);
  }

  return (
    <form action={action}>
      <button type="submit" className="rounded bg-black px-4 py-2 text-white">
        Logout
      </button>
    </form>
  );
}
