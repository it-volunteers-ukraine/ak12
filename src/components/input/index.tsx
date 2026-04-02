"use client";

import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <input
        {...props}
        className={`rounded-lg border px-3 py-2 transition outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"} `}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
