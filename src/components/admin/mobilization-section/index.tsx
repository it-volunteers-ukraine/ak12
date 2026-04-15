"use client";

import z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/button";
import { showMessage } from "@/components/toastify";
import { TextArea } from "@/components/form-elements";
import { FormField } from "@/components/form-elements/form-field";
import { mobilizationSchema } from "@/schemas/mobilizationSchema";
import { updateMobilizationMultiLangAction } from "@/actions/mobilization/mobilizationActions";

import { FormWrapper } from "../form";

type AdminData = z.infer<typeof adminSchema>;
interface IAdminSection {
  data: AdminData;
}

const adminSchema = z.object({
  uk: mobilizationSchema,
  en: mobilizationSchema,
});

export const MobilizationSection = ({ data }: IAdminSection) => {
  const router = useRouter();

  const handleSubmit = async (values: AdminData) => {
    const res = await updateMobilizationMultiLangAction(values);

    if (res.success) {
      showMessage.success("Дані успішно оновилися!");
      router.refresh();
    } else {
      showMessage.error("Не вдалося оновити дані");
    }
  };

  return (
    <FormWrapper
      formConfig={{
        type: "mobilization",
        schema: adminSchema,
        data: data,
      }}
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField name="uk.title" label="Заголовок (UA)" />
        <FormField name="en.title" label="Title (EN)" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField name="uk.subtitle" label="Підзаголовок (UA)" />
        <FormField name="en.subtitle" label="Subtitle (EN)" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField component={TextArea} name="uk.content" label="Зміст (UA)" />
        <FormField component={TextArea} name="en.content" label="Content (EN)" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField name="uk.buttonTitle" label="Назва кнопки (UA)" />
        <FormField name="en.buttonTitle" label="Button Title (EN)" />
      </div>
      <Button type="submit" title="Зберегти" />
    </FormWrapper>
  );
};
