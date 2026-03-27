"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { adminLogin } from "@/actions/auth/login";

export function LoginForm() {
  const params = useParams();
  const locale = params.locale as string;
  const [serverError, setServerError] = useState("");

  async function action(formData: FormData) {
    formData.append("locale", locale);

    const res = await adminLogin(formData);

    if (res?.error) {
      setServerError(res.error);
    }
  }

  return (
    <form action={action} className="mx-auto mt-20 max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Login Form</h1>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          className="w-full rounded border p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="w-full rounded border p-2"
          required
        />
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button type="submit" className="w-full rounded bg-black p-2 text-white">
        Login
      </button>
    </form>
  );
}
