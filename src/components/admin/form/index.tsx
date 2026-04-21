"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, DefaultValues } from "react-hook-form";

import { Button } from "@/components/button";
import { showMessage } from "@/components/toastify";
import { AllAdminForms } from "@/lib/admin/admin-types";
import { ConfirmModal } from "@/components/confirm-modal/ui";

type SubmitResult = {
  error?: string;
  success: boolean;
};
export type FormStatus = {
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
};
interface IFormWrapperProps<T extends AllAdminForms> {
  formConfig: T;
  isOpen?: boolean;
  className?: string;
  children: React.ReactNode | ((status: FormStatus) => React.ReactNode);
  onSubmit: (data: T["data"]) => Promise<SubmitResult | void> | SubmitResult | void;
}

export const FormWrapper = <T extends AllAdminForms>({
  onSubmit,
  children,
  className,
  formConfig,
}: IFormWrapperProps<T>) => {
  const { schema, data } = formConfig;

  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [currentData, setCurrentData] = useState<T["data"] | null>(null);

  const safeData = {
    en: data?.en ?? {},
    uk: data?.uk ?? {},
  };

  const methods = useForm<T["data"]>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: safeData as DefaultValues<T["data"]>,
  });

  const { isValid, isDirty, isSubmitting } = methods.formState;

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
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onFormSubmit)} className={className}>
        {typeof children === "function" ? children({ isValid, isDirty, isSubmitting }) : children}
      </form>

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
    </FormProvider>
  );
};
