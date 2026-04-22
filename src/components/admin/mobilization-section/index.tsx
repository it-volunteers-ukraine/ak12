"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/button";
import { logger } from "@/lib/logger";
import { showMessage } from "@/components/toastify";
import { AdminDataMap, ADMIN_SCHEMAS } from "@/lib/admin";
import { ConfirmModal } from "@/components/confirm-modal/ui";
import { updateMobilizationMultiLangAction } from "@/actions/mobilization/mobilizationActions";

import { FormWrapper } from "../form";
import { MobilizationForm } from "./mobilization-form";

type AdminData = AdminDataMap["mobilization"];
interface IAdminSection {
  data: AdminData;
}

const adminSchema = ADMIN_SCHEMAS.mobilization;

export const MobilizationSection = ({ data }: IAdminSection) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingData, setPendingData] = useState<AdminData | null>(null);

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
      logger.error({ error }, "Mobilization form submission failed");
      showMessage.error("Не вдалося оновити дані");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FormWrapper
        formConfig={{
          type: "mobilization",
          schema: adminSchema,
          data: data,
        }}
        onSubmit={onFormSubmit}
      >
        {(status) => <MobilizationForm data={data} isValid={status.isValid} />}
      </FormWrapper>

      <ConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ConfirmModal.ModalTitle>Підтвердіть зміни</ConfirmModal.ModalTitle>
        <ConfirmModal.ModalContent>
          Ви впевнені, що хочете зберегти зміни в секції мобілізації?
        </ConfirmModal.ModalContent>
        <ConfirmModal.ModalFooter>
          <Button
            type="button"
            variant="primary"
            isLoading={isLoading}
            onClick={handleConfirm}
            className="w-full rounded-full"
          >
            Так, зберегти
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => setIsModalOpen(false)}
            className="w-full rounded-full"
            disabled={isLoading}
          >
            Скасувати
          </Button>
        </ConfirmModal.ModalFooter>
      </ConfirmModal>
    </>
  );
};
