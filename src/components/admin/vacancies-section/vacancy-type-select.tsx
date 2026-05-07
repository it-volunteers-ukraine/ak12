"use client";

import { useFormContext } from "react-hook-form";
import { vacancyTypes } from "@/types/vacancy";

const LABELS: Record<string, string> = {
  frontline: "Бойова",
  backline: "Тилова",
};

interface Props {
  name: string;
  className?: string;
}

export const VacancyTypeRadio = ({ name }: Props) => {
  const { register, formState: { errors } } = useFormContext();
  const error = name.split(".").reduce((obj: any, key) => obj?.[key], errors);

  return (
    <div>
      <div className="flex gap-6">
        {vacancyTypes.map((type) => (
          <label key={type} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              value={type}
              {...register(name)}
              className="h-4 w-4 accent-blue-600"
            />
            {LABELS[type]}
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{String(error.message)}</p>
      )}
    </div>
  );
};