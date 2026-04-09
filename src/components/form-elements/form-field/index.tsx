"use client";

import React from "react";

import { Path, FieldValues, useController, useFormContext } from "react-hook-form";

import { getStyles } from "./styles";
import { TextInput } from "../input";

type FormFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  component?: React.ElementType;
} & React.ComponentPropsWithoutRef<"input">;

export const FormField = <T extends FieldValues>({
  name,
  label,
  className,
  placeholder,
  component: Component = TextInput,
  ...props
}: FormFieldProps<T>) => {
  const { control } = useFormContext<T>();

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const { labelStyle, wrapperStyle, errorStyle } = getStyles({ error, className });

  return (
    <div className="flex flex-col gap-2">
      <label className={labelStyle}>{label}</label>
      <div className={wrapperStyle}>
        <Component {...field} {...props} value={field.value ?? ""} invalid={!!error} />

        <div className="min-h-5"> {error && <p className={errorStyle}>{error.message}</p>}</div>
      </div>
    </div>
  );
};
