"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, DefaultValues, FieldValues } from "react-hook-form";
import { AllAdminForms } from "./types";

type FormResolver<T extends FieldValues> = NonNullable<Parameters<typeof useForm<T>>[0]>["resolver"];

export type FormStatus = {
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
};

interface IFormWrapperProps<T extends AllAdminForms> {
  formConfig: T;
  className?: string;
  onSubmit: (data: T["data"]) => Promise<void> | void;
  children: React.ReactNode | ((status: FormStatus) => React.ReactNode);
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
    resolver: zodResolver(schema) as FormResolver<T["data"]>,
    defaultValues: safeData as DefaultValues<T["data"]>,
  });

  const { isValid, isDirty, isSubmitting } = methods.formState;

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={methods.handleSubmit(onSubmit as any)} 
        className={className}
      >
        {typeof children === "function" 
          ? children({ isValid, isDirty, isSubmitting }) 
          : children}
      </form>
    </FormProvider>
  );
};
