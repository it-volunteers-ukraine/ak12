"use client";

import { useParams } from "next/navigation";
import { useActionState, useState, useEffect } from "react";
import { adminLogin } from "@/actions/auth/login";
import type { State } from "@/types";
import { LoginEyeOffIcon, LoginEyeOnIcon } from "@/assets/icon";

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
      className="m-auto flex w-170 flex-col rounded-xs border border-[#dde1e6] bg-white p-20"
      noValidate
    >
      <h1 className="mb-12 w-130 text-center text-[42px] leading-[1.1] font-bold text-[#21272a]">Вхід до системи</h1>
      <div className="mb-9 flex w-130 flex-col">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-[14px] leading-[1.4] font-normal text-[#21272a]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Почніть писати..."
            className="border border-[#c1c7cd] bg-[#f2f4f8] px-4 py-3 text-base leading-[1.4] text-[#21272a]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {state.fieldErrors.email?.[0] ? (
          <p className="flex min-h-4 items-center text-xs leading-[1.2] text-red-400">{state.fieldErrors.email[0]}</p>
        ) : (
          <div className="min-h-4" />
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-[14px] leading-[1.4] font-normal text-[#21272a]">
            Пароль
          </label>
          <div className="relative flex flex-col">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Почніть писати..."
              className="border border-[#c1c7cd] bg-[#f2f4f8] px-4 py-3 text-base leading-[1.4] text-[#21272a]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2"
            >
              {showPassword ? <LoginEyeOffIcon className="h-6 w-6" /> : <LoginEyeOnIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {state.fieldErrors.password?.[0] || state.error ? (
          <p className="flex min-h-4 items-center text-xs leading-[1.2] text-red-400">
            {state.fieldErrors.password?.[0] || state.error}
          </p>
        ) : (
          <div className="min-h-4" />
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="flex h-12 w-130 items-center justify-center border-2 border-[#0f62fe] bg-[#0f62fe] px-3 py-4 text-base font-medium text-white disabled:opacity-50"
      >
        Увійти
      </button>
    </form>
  );
}
