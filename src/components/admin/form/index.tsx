"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, DefaultValues } from "react-hook-form";

import { AllAdminForms } from "./types";

interface IFormWrapperProps<T extends AllAdminForms> {
  formConfig: T;
  children: React.ReactNode;
  onSubmit: (data: T["data"]) => Promise<void> | void;
}

export const FormWrapper = <T extends AllAdminForms>({ formConfig, onSubmit, children }: IFormWrapperProps<T>) => {
  const { schema, data } = formConfig;

  const methods = useForm<T["data"]>({
    mode: "onBlur",
    resolver: zodResolver(schema),
    defaultValues: data as DefaultValues<T["data"]>,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {children}
      </form>
    </FormProvider>
  );
};
