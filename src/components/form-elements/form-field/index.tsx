"use client";

import React from "react";

import { Path, FieldValues, useController, useFormContext } from "react-hook-form";

import { getStyles } from "./styles";
import { TextInput } from "../input";

type FormFieldProps<TFieldValues extends FieldValues, TElement extends React.ElementType> = {
  label?: string;
  component?: TElement;
  name: Path<TFieldValues>;
  wrapperComponentClassName?: string;
} & React.ComponentPropsWithoutRef<TElement>;

export const FormField = <TFieldValues extends FieldValues, TElement extends React.ElementType = typeof TextInput>({
  name,
  label,
  component,
  className,
  placeholder,
  wrapperComponentClassName,
  ...props
}: FormFieldProps<TFieldValues, TElement>) => {
  const Component = component || TextInput;
  const { control } = useFormContext<TFieldValues>();

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const { labelStyle, wrapperStyle, errorStyle, wrapper } = getStyles({ error, wrapperComponentClassName });

  return (
    <div className={wrapper}>
      {label && <label className={labelStyle}>{label}</label>}
      <div className={wrapperStyle}>
        <Component {...field} {...props} value={field.value ?? ""} invalid={!!error} className={className} />

        <div className="min-h-5"> {error && <p className={errorStyle}>{error.message}</p>}</div>
      </div>
    </div>
  );
};
