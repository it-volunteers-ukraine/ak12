"use client";

import z from "zod";
import { useRouter } from "next/navigation";

import { showMessage } from "@/components/toastify";
import { heroContentSchema } from "@/schemas/heroContent";
import { updateHeroMultiLangAction } from "@/actions/hero/heroActions";

import { HeroForm } from "./hero-form";
import { WrapperWithModal } from "../form-wrapper-with-modal";

interface IHeroSection {
  data: AdminData;
}
export type AdminData = z.infer<typeof adminSchema>;

const adminSchema = z.object({
  uk: heroContentSchema,
  en: heroContentSchema,
});

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
    if (res.success) {
      router.refresh();
    }
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
        {(setIsOpen, status) => <HeroForm setIsOpen={setIsOpen} data={data} isValid={status.isValid} />}
      </WrapperWithModal>
    </>
  );
};
