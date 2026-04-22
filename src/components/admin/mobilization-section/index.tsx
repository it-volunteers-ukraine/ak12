"use client";

import { useState } from "react";

import z from "zod";
import { useRouter } from "next/navigation";

import { showMessage } from "@/components/toastify";
import { ADMIN_SCHEMAS } from "@/lib/admin/admin-schemas";
import { AdminDataMap } from "@/lib/admin/admin-types";
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
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingData, setPendingData] = useState<FormValues | null>(null);

  const onFormSubmit = (values: AdminData) => {
    setPendingData(values);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingData) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await updateMobilizationMultiLangAction(pendingData);

      if (res.success) {
        showMessage.success("Дані успішно оновилися!");
        setIsModalOpen(false);
        router.refresh();
      } else {
        showMessage.error("Не вдалося оновити дані");
      }
    } catch (error) {
      console.error({ error }, "Mobilization form submission failed");
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
        isOpen={isModalOpen}
        title="Підтвердіть зміни"
        content="Ви впевнені, що хочете зберегти зміни в секції мобілізації?"
        isLoading={isLoading}
        onClose={() => setIsModalOpen(false)}
        handleConfirm={handleConfirm}
      />
    </>
  );
};
