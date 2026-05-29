"use client";

import { useFormContext } from "react-hook-form";
import { TextInput } from "@/components/form-elements/input";

interface Props {
  nameMin: string;
  nameMax: string;
  label?: string;
}

export const SalaryInput = ({ nameMin, nameMax, label = "Зарплата (грн) *" }: Props) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const salaryMin = watch(nameMin);
  const salaryMax = watch(nameMax);

  const displayValue = salaryMin && salaryMax ? `${salaryMin}-${salaryMax}` : salaryMin ? String(salaryMin) : "";

  const errorMin = nameMin.split(".").reduce((obj: any, key) => obj?.[key], errors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();

    if (!raw) {
      setValue(nameMin, undefined, { shouldValidate: true });
      setValue(nameMax, undefined, { shouldValidate: true });

      return;
    }

    const parts = raw.split(/[-\s]+/).filter(Boolean);

    if (parts.length >= 2) {
      const min = parseInt(parts[0], 10);
      const max = parseInt(parts[1], 10);

      setValue(nameMin, isNaN(min) ? undefined : min, { shouldValidate: true });
      setValue(nameMax, isNaN(max) ? undefined : max, { shouldValidate: true });
    } else {
      const min = parseInt(parts[0], 10);

      setValue(nameMin, isNaN(min) ? undefined : min, { shouldValidate: true });
      setValue(nameMax, undefined, { shouldValidate: true });
    }
  };

  return (
    <div>
      {label && <label className="mb-2 block text-sm font-medium">{label}</label>}
      <TextInput
        defaultValue={displayValue}
        onChange={handleChange}
        placeholder="Наприклад: 20000 або 20000-170000"
        invalid={Boolean(errorMin)}
      />
      <p className="mt-1 text-xs text-gray-400">Одне число — мінімальна зарплата, діапазон через дефіс — від і до</p>
      {errorMin && <p className="mt-1 text-xs text-red-500">{String(errorMin.message)}</p>}
    </div>
  );
};
