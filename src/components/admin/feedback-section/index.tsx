"use client";

import z from "zod";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { FormWrapper } from "../form";
import { SECTION_KEYS } from "@/constants";
import { FormBuilder } from "@/lib/form-builder";
import { showMessage } from "@/components/toastify";
import { AdminDataMap } from "@/lib/admin/admin-types";
import { ADMIN_SCHEMAS } from "@/lib/admin/admin-schemas";
import { ConfirmModal } from "@/components/connfirm-modal";
import { updateContentMultiLang } from "@/actions/content/content";
import { feedbackFormBuilderConfig } from "@/lib/admin/configs/feedback.config";

type FormValues = z.infer<typeof adminSchema>;
type AdminData = AdminDataMap["feedback"];

interface IHeaderSection {
  data: AdminData;
}

const adminSchema = ADMIN_SCHEMAS["feedback"];

export const FeedbackSection = ({ data }: IHeaderSection) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState<FormValues | null>(null);

  const handleSubmit = async (values: FormValues) => {
    try {
      const res = await updateContentMultiLang(SECTION_KEYS.FEEDBACK, values);

      if (!res.success) {
        showMessage.error("Не вдалося оновити дані");

        return res;
      }

      showMessage.success("Дані успішно оновилися!");

      router.refresh();

      return res;
    } catch {
      showMessage.error("Не вдалося оновити дані");

      return {
        success: false,
        error: "Internal Server Error",
      };
    }
  };

  const onFormSubmit = (values: FormValues) => {
    setPendingData(values);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingData) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await handleSubmit(pendingData);

      if (result && !result.success) {
        toast.error(result.error || "Помилка збереження");

        return;
      }
    } catch {
      toast.error("Щось пішло не так");
    } finally {
      setIsModalOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <FormWrapper<FormValues>
        schema={adminSchema}
        initialValues={data}
        onSubmit={onFormSubmit}
        key={data.uk?.form?.title || data.en?.form?.title || "feedback"}
      >
        <FormBuilder data={data} config={feedbackFormBuilderConfig} />
      </FormWrapper>
      <ConfirmModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        title="Підтвердіть зміни"
        handleConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
        content="Ви впевнені, що хочете зберегти зміни в секції Зворотній зв'язок?"
      />
    </>
  );
};
