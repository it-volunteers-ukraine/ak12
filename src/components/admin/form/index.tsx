"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, DefaultValues } from "react-hook-form";

import { AllAdminForms } from "./types";

interface IFormWrapperProps<T extends AllAdminForms> {
  formConfig: T;
  className?: string;
  children: React.ReactNode;
  onSubmit: (data: T["data"]) => Promise<void> | void;
}

export const FormWrapper = <T extends AllAdminForms>({
  onSubmit,
  children,
  className,
  formConfig,
}: IFormWrapperProps<T>) => {
  const { schema, data } = formConfig;

  const methods = useForm<T["data"]>({
    mode: "onBlur",
    resolver: zodResolver(schema),
    defaultValues: data as DefaultValues<T["data"]>,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
};
