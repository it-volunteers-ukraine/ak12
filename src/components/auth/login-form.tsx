"use client";

import { useParams } from "next/navigation";
import { useActionState, useState, useEffect } from "react";
import { adminLogin } from "@/actions/auth/login";
import type { State } from "@/types";

const initialState: State = {
  fieldErrors: {},
  error: "",
};

export function LoginForm() {
  const params = useParams();
  const locale = params.locale as string;
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, action, isPending] = useActionState<State, FormData>((prevState, formData) => {
    formData.append("locale", locale);

    return adminLogin(prevState, formData);
  }, initialState);

  useEffect(() => {
    if (state.error === "Invalid credentials") {
      setPassword("");
    }
  }, [state.error]);

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
        {state.fieldErrors.email?.[0] && <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email[0]}</p>}
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
        {state.fieldErrors.password?.[0] && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.password[0]}</p>
        )}
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={isPending} className="w-full rounded bg-black p-2 text-white disabled:opacity-50">
        Login
      </button>
    </form>
  );
}
