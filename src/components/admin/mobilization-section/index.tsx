"use client";

import { useState } from "react";

import z from "zod";
import { useRouter } from "next/navigation";

import { showMessage } from "@/components/toastify";
import { AdminDataMap } from "@/lib/admin/admin-types";
import { ADMIN_SCHEMAS } from "@/lib/admin/admin-schemas";
import { ConfirmModal } from "@/components/connfirm-modal";
import { updateMobilizationMultiLangAction } from "@/actions/mobilization/mobilizationActions";

import { FormWrapper } from "../form";
import { MobilizationForm } from "./mobilization-form";

type FormValues = z.infer<typeof adminSchema>;
type AdminData = AdminDataMap["mobilization"];
interface IAdminSection {
  data: AdminData;
}

const adminSchema = ADMIN_SCHEMAS.mobilization;

export const MobilizationSection = ({ data }: IAdminSection) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [currentData, setCurrentData] = useState<FormValues | null>(null);

  const router = useRouter();

  const onFormSubmit = (values: FormValues) => {
    setCurrentData(values);
    setIsOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof adminSchema>) => {
    const res = await updateMobilizationMultiLangAction(values);

    if (res.success) {
      showMessage.success("Дані успішно оновилися!");
      router.refresh();
    } else {
      showMessage.error("Не вдалося оновити дані");
    }

    return res;
  };

  const handleConfirm = async () => {
    if (!currentData) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await onSubmit(currentData);

      if (result && !result.success) {
        return;
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Form submission failed:", error);

      showMessage.error("Не вдалося оновити дані");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FormWrapper<FormValues> schema={adminSchema} initialValues={data} onSubmit={onFormSubmit}>
        {(methods) => <MobilizationForm data={data} isValid={methods.formState.isValid} />}
      </FormWrapper>

      <ConfirmModal
        isOpen={isOpen}
        title="Підтвердіть зміни"
        content="Ви впевнені, що хочете зберегти зміни в секції мобілізації?"
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
        handleConfirm={handleConfirm}
      />
    </>
  );
};
