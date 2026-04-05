"use client";

import z from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/button";
import { FormField } from "@/components/form-elements";
import { heroContentSchema } from "@/schemas/heroContent";
import { updateHeroMultiLangAction } from "@/actions/hero/heroActions";

import { FormWrapper } from "../form";

interface IHeroSection {
  data: AdminData;
}
type AdminData = z.infer<typeof adminSchema>;

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
      router.refresh();
    }
  };

  return (
    <FormWrapper
      formConfig={{
        data: data,
        type: "hero",
        schema: adminSchema,
      }}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <FormField name="uk.title" label="titleUk" />
        <FormField name="uk.subtitle" label="subtitleUk" />
      </div>
      <div>
        <FormField name="en.title" label="titleEn" />
        <FormField name="en.subtitle" label="subtitleEn" />
      </div>

      <FormField name="uk.backgroundImage" placeholder="https://example.com/image.jpg" label="backgroundImage" />
      <Image
        className="rounded-lg object-cover"
        alt="main-banner"
        width={100}
        height={100}
        src={
          data.uk?.backgroundImage ||
          data.en?.backgroundImage ||
          "https://i.pinimg.com/736x/24/11/42/241142e0b2024e219879c624a153264a.jpg"
        }
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField name="uk.primaryButton.text" label="primaryButtonTextUK " />
        <FormField name="en.primaryButton.text" label="primaryButtonTextEn " />
      </div>
      <Button variant="primary" type="button">
        Зберегти
      </Button>
    </FormWrapper>
  );
};
