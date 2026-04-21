"use client";

import z from "zod";
import { useRouter } from "next/navigation";

import { showMessage } from "@/components/toastify";
import { AdminDataMap } from "@/lib/admin/admin-types";
import { ADMIN_SCHEMAS } from "@/lib/admin/admin-schemas";
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

  const handleSubmit = async (values: z.infer<typeof adminSchema>) => {
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
      {(status) => <MobilizationForm data={data} isValid={status.isValid} />}
    </FormWrapper>
  );
};
