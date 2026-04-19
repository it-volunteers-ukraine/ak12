"use client";

import { useRouter } from "next/navigation";

import { showMessage } from "@/components/toastify";
import { updateMobilizationMultiLangAction } from "@/actions/mobilization/mobilizationActions";

import { AdminData, adminSchema } from "./config";
import { MobilizationForm } from "./mobilization-form";
import { WrapperWithModal } from "../form-wrapper-with-modal";

interface IAdminSection {
  data: AdminData;
}

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
    <WrapperWithModal
      formConfig={{
        type: "mobilization",
        schema: adminSchema,
        data: data,
      }}
      onSubmit={handleSubmit}
    >
      {(status) => <MobilizationForm data={data} isValid={status.isValid} />}
    </WrapperWithModal>
  );
};
