import Image from "next/image";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/button";
import { FormField } from "@/components/form-elements";

import { AdminData } from "..";

interface IHeroForm {
  data: AdminData;
  isValid: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const HeroForm = ({ data, isValid, setIsOpen }: IHeroForm) => {
  const { reset } = useFormContext();

  const bannerImg =
    data.uk?.backgroundImage ||
    data.en?.backgroundImage ||
    "https://i.pinimg.com/736x/24/11/42/241142e0b2024e219879c624a153264a.jpg";

  return (
    <>
      <div className="flex flex-col gap-4">
        <FormField name="uk.title" label="titleUk" />
        <FormField name="uk.subtitle" label="subtitleUk" />
      </div>
      <div>
        <FormField name="en.title" label="titleEn" />
        <FormField name="en.subtitle" label="subtitleEn" />
      </div>
      <FormField name="uk.backgroundImage" placeholder="https://example.com/image.jpg" label="backgroundImage" />
      <Image className="rounded-lg object-cover" alt="main-banner" width={100} height={100} src={bannerImg} />
      <div className="grid grid-cols-2 gap-4">
        <FormField name="uk.primaryButton.text" label="primaryButtonTextUK " />
        <FormField name="en.primaryButton.text" label="primaryButtonTextEn " />
      </div>

      <Button variant="primary" type="submit" onClick={() => setIsOpen(true)} disabled={!isValid}>
        Зберегти
      </Button>
      <Button variant="outline" type="reset" onClick={() => reset(data)}>
        Скасувати
      </Button>
    </>
  );
};
