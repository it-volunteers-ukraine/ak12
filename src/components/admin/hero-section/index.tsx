"use client";

import { useRouter } from "next/navigation";

import { showMessage } from "@/components/toastify";
import { updateHeroMultiLangAction } from "@/actions/hero/heroActions";

import { HeroForm } from "./hero-form";
import { WrapperWithModal } from "../form-wrapper-with-modal";
import { AdminData, adminSchema, IHeroSection } from "./config";

export const HeroSection = ({ data }: IHeroSection) => {
  const router = useRouter();

  const handleSubmit = async (values: AdminData) => {
    const enrichedValues = {
      ...values,
      en: {
        ...values.en,
        backgroundImage: values.uk.backgroundImage,
      },
    };

    const res = await updateHeroMultiLangAction(enrichedValues);

    if (res.success) {
      showMessage.success("Дані успішно оновилися!");
      router.refresh();
    } else {
      showMessage.error("Не вдалося оновити дані");
    }

    return res;
  };

  return (
    <>
      <WrapperWithModal
        formConfig={{
          data: data,
          type: "hero",
          schema: adminSchema,
        }}
        onSubmit={handleSubmit}
      >
        {(status) => <HeroForm data={data} isValid={status.isValid} />}
      </WrapperWithModal>
    </>
  );
};
