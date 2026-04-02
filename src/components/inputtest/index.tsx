"use client";

import { useFormContext } from "react-hook-form";

interface InputProps {
  name: string;
  label: string;
  placeholder?: string;
}

export const InputTest = ({ name, label, placeholder }: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = name.split(".").reduce((obj, key) => obj?.[key], errors as any)?.message;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...register(name)}
        placeholder={placeholder}
        className={`rounded border p-2 ${fieldError ? "border-red-500" : "border-gray-300"}`}
      />
      {fieldError && <span className="text-xs text-red-500">{fieldError as string}</span>}
    </div>
  );
};
