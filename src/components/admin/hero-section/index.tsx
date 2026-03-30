"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Input from "@/components/input";
import { Button } from "@/components/button";
import { HeroSchema } from "@/schemas/heroContent";
import { updateHeroMultiLangAction } from "@/actions/hero/heroActions";

interface TAdminData {
  en: HeroSchema | null;
  uk: HeroSchema | null;
}
interface IHeroSection {
  data: TAdminData;
}

export const HeroSection = ({ data }: IHeroSection) => {
  const router = useRouter();
  const { uk: dataUK, en: dataEN } = data;

  const handleSubmit = async (formData: FormData) => {
    const res = await updateHeroMultiLangAction(formData);

    if (res.success) {
      router.refresh();
    }
  };

  return (
    <div className="space-y-4 rounded border bg-white p-6 text-black shadow">
      <form action={handleSubmit} className="flex flex-col gap-y-4">
        <div>
          <Input name="titleUk" defaultValue={dataUK?.title} label="titleUk" />
          <Input name="subtitleUk" defaultValue={dataUK?.subtitle} label="subtitleUk" />
        </div>
        <div>
          <Input name="titleEn" defaultValue={dataEN?.title} label="titleEn" />
          <Input name="subtitleEn" defaultValue={dataEN?.subtitle} label="subtitleEn" />
        </div>

        <Input
          name="backgroundImage"
          defaultValue={dataUK?.backgroundImage || dataEN?.backgroundImage}
          placeholder="https://example.com/image.jpg"
          label="backgroundImage"
        />
        <Image
          className="rounded-lg object-cover"
          alt="main-banner"
          width={100}
          height={100}
          src={
            dataUK?.backgroundImage ||
            dataEN?.backgroundImage ||
            "https://i.pinimg.com/736x/24/11/42/241142e0b2024e219879c624a153264a.jpg"
          }
        />
        <div>
          <Input name="primaryButtonTextEn" defaultValue={dataEN?.primaryButton?.text} label="primaryButtonTextEn" />
          <Input name="primaryButtonTextUk" defaultValue={dataUK?.primaryButton?.text} label="primaryButtonTextUk" />
        </div>

        <Button title="submit" />
      </form>
    </div>
  );
};
