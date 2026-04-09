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
        className="flex h-8 w-8 items-center justify-center bg-transparent"
        aria-label="Вийти"
        title="Вийти"
      >
        <LogoutIcon className="h-8 w-8" />
      </button>
    </form>
  );
}
