"use client";

import { useEffect, type ReactNode } from "react";

import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  FormProvider,
  type FieldValues,
  type UseFormProps,
  type DefaultValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";

type TFormWrapper<TValues extends FieldValues> = {
  className?: string;
  initialValues: TValues;
  enableReinitialize?: boolean;
  onSubmit: SubmitHandler<TValues>;
  schema: z.ZodType<TValues, TValues>;
  options?: Omit<UseFormProps<TValues>, "resolver" | "defaultValues">;
  children: ReactNode | ((methods: UseFormReturn<TValues>) => ReactNode);
};
export type FormStatus = {
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
};

export const FormWrapper = <TValues extends FieldValues>({
  schema,
  initialValues,
  onSubmit,
  enableReinitialize,
  className,
  children,
  options,
}: TFormWrapper<TValues>) => {
  const methods = useForm<TValues>({
    ...options,
    defaultValues: initialValues as DefaultValues<TValues>,
    resolver: zodResolver(schema),
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (!enableReinitialize) {
      return;
    }

    reset(initialValues as DefaultValues<TValues>);
  }, [enableReinitialize, initialValues, reset]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className={className}>
          {typeof children === "function" ? children(methods) : children}
        </form>
      </FormProvider>
    </>
  );
};
