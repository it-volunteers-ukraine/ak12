"use client";

import { useParams } from "next/navigation";
import { logout } from "@/actions/auth/logout";
import { LogoutIcon } from "../../../public/icons";

export function LogoutForm() {
  const params = useParams();
  const locale = params.locale as string;

  async function action(formData: FormData) {
    formData.append("locale", locale);
    await logout(formData);
  }

  return (
    <form action={action}>
      <button
        type="submit"
        className="flex items-center gap-2 rounded-lg bg-transparent px-4 py-2 transition-colors hover:bg-gray-100"
        aria-label="Вийти"
        title="Вийти"
      >
        <span>Вийти</span>
        <LogoutIcon className="h-8 w-8" />
      </button>
    </form>
  );
}
