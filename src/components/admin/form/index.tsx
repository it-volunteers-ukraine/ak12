"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, DefaultValues } from "react-hook-form";

import { HeroSchema, heroContentSchema } from "@/schemas";
import { TestSchema, mobilizationSchema } from "@/schemas/testContent";

type MultiLang<S extends z.ZodRawShape, D> = {
  data: {
    en: D;
    uk: D;
  };
  schema: z.ZodObject<{
    en: z.ZodObject<S>;
    uk: z.ZodObject<S>;
  }>;
};
export type AllAdminForms =
  | ({ type: "hero" } & MultiLang<typeof heroContentSchema.shape, HeroSchema>)
  | ({ type: "mobilization" } & MultiLang<typeof mobilizationSchema.shape, TestSchema>);
interface IFormWrapperProps<T extends AllAdminForms> {
  formConfig: T;
  children: React.ReactNode;
  onSubmit: (data: T["data"]) => Promise<void> | void;
}

export const FormWrapper = <T extends AllAdminForms>({ formConfig, onSubmit, children }: IFormWrapperProps<T>) => {
  const { schema, data } = formConfig;

  const methods = useForm<T["data"]>({
    resolver: zodResolver(schema),
    defaultValues: data as DefaultValues<T["data"]>,
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {children}
      </form>
    </FormProvider>
  );
};
