"use client";

import { useParams } from "next/navigation";
import { useActionState, useState, useEffect } from "react";
import { adminLogin } from "@/actions/auth/login";
import type { State } from "@/types";
import { LoginEyeOffIcon, LoginEyeOnIcon } from "../../../public/icons";

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
    <form
      action={action}
      className="border-auth-surface-border m-auto flex w-170 flex-col rounded-xs border bg-white p-20"
      noValidate
    >
      <h1 className="text-auth-text mb-12 w-130 text-center text-[42px] leading-[1.1] font-bold">Вхід до системи</h1>
      <div className="mb-4 flex w-130 flex-col">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-auth-text text-[14px] leading-[1.4] font-normal">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Почніть писати..."
            className="text-auth-text border-auth-input-border bg-auth-input-bg border px-4 py-3 text-base leading-[1.4]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="flex items-center text-xs leading-[1.2] text-red-400">
            {state.fieldErrors.email?.[0] ?? "\u00A0"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-auth-text text-[14px] leading-[1.4] font-normal">
            Пароль
          </label>
          <div className="relative flex flex-col">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Почніть писати..."
              className="text-auth-text border-auth-input-border bg-auth-input-bg border py-3 pr-10 pl-4 text-base leading-[1.4]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2"
              aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
            >
              {showPassword ? <LoginEyeOffIcon className="h-6 w-6" /> : <LoginEyeOnIcon className="h-6 w-6" />}
            </button>
          </div>
          <p className="flex items-center text-xs leading-[1.2] text-red-400">
            {state.fieldErrors.password?.[0] || "\u00A0"}
          </p>
        </div>
        <p className="flex items-center text-xs leading-[1.2] text-red-400">
          {state.error && !state.fieldErrors.password?.[0] ? state.error : "\u00A0"}
        </p>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="border-auth-primary bg-auth-primary flex h-12 w-130 items-center justify-center border-2 px-3 py-4 text-base font-medium text-white disabled:opacity-50"
      >
        Увійти
      </button>
    </form>
  );
}
