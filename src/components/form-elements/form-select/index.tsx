import { FieldValues, useController } from "react-hook-form";

import { cn } from "@/utils";

import { Select } from "./select";
import { FormSelectProps } from "./types";

export const FormSelect = <T extends FieldValues>({
  name,
  label,
  options,
  onChange,
  className,
  placeholder,
}: FormSelectProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="w-fit text-sm font-medium">{label}</label>

      <div className="flex w-full flex-col gap-2">
        <Select
          {...field}
          onChange={(value) => {
            field.onChange(value);
            onChange?.(value);
          }}
          options={options}
          placeholder={placeholder}
          value={field.value ?? ""}
          invalid={!!error}
        />

        {error && <p className="text-[0.8rem] font-medium text-red-500">{error.message}</p>}
      </div>
    </div>
  );
};
