"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { adminLogin } from "@/actions/auth/login";
import type { FieldErrors } from "@/types";

export function LoginForm() {
  const params = useParams();
  const locale = params.locale as string;
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function action(formData: FormData) {
    setServerError("");
    setFieldErrors({});

    formData.append("locale", locale);

    const res = await adminLogin(formData);

    if (res?.fieldErrors) {
      setFieldErrors(res.fieldErrors);

      return;
    }

    if (res?.error) {
      setServerError(res.error);

      return;
    }
  }

  return (
    <form action={action} className="mx-auto mt-20 max-w-md space-y-4" noValidate>
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {fieldErrors.email?.[0] && <p className="mt-1 text-sm text-red-600">{fieldErrors.email[0]}</p>}
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full rounded border p-2 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-sm text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {fieldErrors.password?.[0] && <p className="mt-1 text-sm text-red-600">{fieldErrors.password[0]}</p>}
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button type="submit" className="w-full rounded bg-black p-2 text-white">
        Login
      </button>
    </form>
  );
}
