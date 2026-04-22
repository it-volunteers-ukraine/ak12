"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, DefaultValues } from "react-hook-form";

import { AllAdminForms } from "@/lib/admin";

export type FormStatus = {
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
};

interface IFormWrapperProps<T extends AllAdminForms> {
  formConfig: T;
  className?: string;
  children: React.ReactNode | ((status: FormStatus) => React.ReactNode);
  onSubmit: (data: T["data"]) => void;
}

export const FormWrapper = <T extends AllAdminForms>({
  onSubmit,
  children,
  className,
  formConfig,
}: IFormWrapperProps<T>) => {
  const { schema, data } = formConfig;

  const safeData = {
    en: data?.en ?? {},
    uk: data?.uk ?? {},
  };

  const methods = useForm<T["data"]>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: safeData as DefaultValues<T["data"]>,
  });

  const { isValid, isDirty, isSubmitting } = methods.formState;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {typeof children === "function" ? children({ isValid, isDirty, isSubmitting }) : children}
      </form>
    </FormProvider>
  );
};
