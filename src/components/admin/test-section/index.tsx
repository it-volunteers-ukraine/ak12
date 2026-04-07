"use client";

import z from "zod";

import { Button } from "@/components/button";
import { FormField } from "@/components/form-elements/form-field";
import { mobilizationSchema } from "@/schemas/mobilizationSchema";

import { FormWrapper } from "../form";

type AdminData = z.infer<typeof adminSchema>;

const adminSchema = z.object({
  uk: mobilizationSchema,
  en: mobilizationSchema,
});

export const TestSection = ({ data }: { data: AdminData }) => {
  const onSubmit = async (values: AdminData) => {
    console.log("Submit values:", values.uk.title);
  };

  return (
    <FormWrapper
      formConfig={{
        type: "mobilization",
        schema: adminSchema,
        data: data,
      }}
      onSubmit={onSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField name="uk.title" label="Заголовок (UA)" />
        <FormField name="en.title" label="Title (EN)" />
      </div>
      <Button title="Зберегти" />
    </FormWrapper>
  );
};
