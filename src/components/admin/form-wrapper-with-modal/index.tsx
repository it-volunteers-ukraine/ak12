"use client";

import { useState } from "react";

import { Button } from "@/components/button";
import { showMessage, ConfirmModal } from "@/components";

import { FormWrapper } from "../form";
import { AllAdminForms } from "../form/types";

export interface IFormStatus {
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
}
interface IWrapperWithModal<T extends AllAdminForms> {
  formConfig: T;
  children: (status: IFormStatus) => React.ReactNode;
  onSubmit: (data: T["data"]) => Promise<void> | void;
}

export const WrapperWithModal = <T extends AllAdminForms>({ formConfig, onSubmit, children }: IWrapperWithModal<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [currentData, setCurrentData] = useState<T["data"] | null>(null);

  const onClose = () => {
    setIsOpen(false);
  };

  const onFormSubmit = (values: T["data"]) => {
    setCurrentData(values);
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    if (!currentData) {
      return;
    }
    setIsLoading(true);
    try {
      await onSubmit(currentData);
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
      <FormWrapper formConfig={formConfig} onSubmit={onFormSubmit}>
        {(status) => children(status)}
      </FormWrapper>

      <ConfirmModal isOpen={isOpen} onClose={onClose}>
        <ConfirmModal.ModalTitle>Підтвердіть реєстрацію</ConfirmModal.ModalTitle>

        <ConfirmModal.ModalContent>Ви впевнені, що хочете зареєструватися з цими даними?</ConfirmModal.ModalContent>
        <ConfirmModal.ModalFooter>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            onClick={handleConfirm}
            className="w-full rounded-full"
          >
            Yes
          </Button>
          <Button variant="danger" onClick={onClose} className="w-full rounded-full" isLoading={isLoading}>
            No
          </Button>
        </ConfirmModal.ModalFooter>
      </ConfirmModal>
    </>
  );
};
