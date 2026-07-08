"use client";

import { useParams } from "next/navigation";
import { useActionState, useState, useEffect, useRef } from "react";
import { adminLogin, verifyTwoFactor } from "@/actions/auth/login.action";
import type { State } from "@/types";
import { LoginEyeOffIcon, LoginEyeOnIcon } from "../../../public/icons";

const initialState: State = {
  fieldErrors: {},
  error: "",
};

const CODE_LENGTH = 6;

export function LoginForm() {
  const params = useParams();
  const locale = params.locale as string;
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const digitRefs = useRef<Array<HTMLInputElement | null>>(Array(CODE_LENGTH).fill(null));

  const [loginState, loginAction, isLoginPending] = useActionState<State, FormData>((_prevState, formData) => {
    formData.append("locale", locale);

    return adminLogin(_prevState, formData);
  }, initialState);

  const [twoFaState, twoFaAction, isTwoFaPending] = useActionState<State, FormData>((_prevState, formData) => {
    formData.append("locale", loginState.locale ?? locale);
    formData.append("code", digits.join(""));

    return verifyTwoFactor(_prevState, formData);
  }, initialState);

  const needsTwoFactor = loginState.needsTwoFactor;

  useEffect(() => {
    if (needsTwoFactor) {
      setDigits(Array(CODE_LENGTH).fill(""));
      digitRefs.current[0]?.focus();
    }
  }, [needsTwoFactor]);

  useEffect(() => {
    if (loginState.fieldErrors.password?.length) {
      setPassword("");
    }
  }, [loginState.fieldErrors.password]);

  useEffect(() => {
    if (twoFaState.fieldErrors.code?.[0]) {
      setDigits(Array(CODE_LENGTH).fill(""));
      digitRefs.current[0]?.focus();
    }
  }, [twoFaState.fieldErrors.code]);

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];

    next[index] = digit;
    setDigits(next);

    if (digit && index < CODE_LENGTH - 1) {
      digitRefs.current[index + 1]?.focus();
    }
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  }

  function handleDigitPaste(index: number, e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH - index);

    const next = [...digits];

    pasted.split("").forEach((char, i) => {
      next[index + i] = char;
    });

    setDigits(next);

    const focusIndex = Math.min(index + pasted.length, CODE_LENGTH - 1);

    digitRefs.current[focusIndex]?.focus();
  }

  return (
    <div className="border-auth-surface-border m-auto flex w-170 flex-col rounded-xs border bg-white p-20">
      <h1 className="text-auth-text mb-12 w-130 text-center text-[42px] leading-[1.1] font-bold">Вхід до системи</h1>

      {!needsTwoFactor && (
        <form action={loginAction} className="flex w-130 flex-col" noValidate>
          <div className="mb-4 flex flex-col">
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
                {loginState.fieldErrors.email?.[0] ?? "\u00A0"}
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
                {loginState.fieldErrors.password?.[0] || "\u00A0"}
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoginPending}
            className="border-auth-primary bg-auth-primary flex h-12 w-130 items-center justify-center border-2 px-3 py-4 text-base font-medium text-white disabled:opacity-50"
          >
            Увійти
          </button>
          <p className="flex items-center text-xs leading-[1.2] text-red-400">{loginState.error || "\u00A0"}</p>
        </form>
      )}

      {needsTwoFactor && (
        <form action={twoFaAction} className="flex w-130 flex-col" noValidate>
          <div className="mb-4 flex flex-col gap-2">
            <label className="text-auth-text text-[14px] leading-[1.4] font-normal">Код підтвердження</label>
            <div className="flex gap-2">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    digitRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(index, e)}
                  onPaste={(e) => handleDigitPaste(index, e)}
                  className="text-auth-text border-auth-input-border bg-auth-input-bg h-12 w-full border text-center text-xl leading-[1.4] font-medium"
                  aria-label={`Цифра ${index + 1}`}
                />
              ))}
            </div>
            <p className="flex items-center text-xs leading-[1.2] text-red-400">
              {twoFaState.fieldErrors.code?.[0] ?? "\u00A0"}
            </p>
          </div>
          <button
            type="submit"
            disabled={isTwoFaPending || digits.join("").length < CODE_LENGTH}
            className="border-auth-primary bg-auth-primary flex h-12 w-130 items-center justify-center border-2 px-3 py-4 text-base font-medium text-white disabled:opacity-50"
          >
            Підтвердити
          </button>
          <p className="flex items-center text-xs leading-[1.2] text-red-400">{twoFaState.error || "\u00A0"}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 text-sm text-gray-400 underline"
          >
            Повернутись
          </button>
        </form>
      )}
    </div>
  );
}
