'use client';

import { useState } from "react";

import { ConfirmModal } from "@/components";
import { Button } from "@/components/button";

import { FormWrapper } from "../form";
import { AllAdminForms } from "../form/types";

interface IWrapperWithModal<T extends AllAdminForms> {
  formConfig: T;
  onSubmit: (data: T["data"]) => Promise<void> | void;
  children: (setIsOpen: (isOpen: boolean) => void) => React.ReactNode | React.ReactNode;
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
    await onSubmit(currentData);
    setIsOpen(false);
    setIsLoading(false);
  };

  return (
    <>
      <FormWrapper formConfig={formConfig} onSubmit={onFormSubmit}>
        {typeof children === "function" ? children(setIsOpen) : children}
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
            className="rounded-full w-full"
          >
            Yes
          </Button>
          <Button variant="danger" onClick={onClose} className="rounded-full w-full" isLoading={isLoading}>
            No
          </Button>
        </ConfirmModal.ModalFooter>
      </ConfirmModal>
    </>
  );
};
