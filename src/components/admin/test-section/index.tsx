"use client";

import z from "zod";

import { Button } from "@/components/button";
import { InputTest } from "@/components/inputtest";
import { mobilizationSchema } from "@/schemas/testContent";

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
        <InputTest name="uk.title" label="Заголовок (UA)" />
        <InputTest name="en.title" label="Title (EN)" />
      </div>
      <Button title="Зберегти" />
    </FormWrapper>
  );
};
