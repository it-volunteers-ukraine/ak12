"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/button";
import { FormImg, FormField } from "@/components/form-elements";
import { AdminData } from "../config";

interface IHeroForm {
  data: AdminData;
  isValid: boolean;
  bannerFile: File | null;
  removeCurrentImage: boolean;
  onBannerFileChange: (file: File | null) => void;
  onBannerRemove: () => void;
}

export const HeroForm = ({
  data,
  isValid,
  bannerFile,
  removeCurrentImage,
  onBannerFileChange,
  onBannerRemove,
}: IHeroForm) => {
  const { setValue, reset } = useFormContext();
  const bannerImage = removeCurrentImage ? null : data.uk?.backgroundImage || data.en?.backgroundImage || null;
  const bannerImg = bannerImage?.secureUrl || null;

  useEffect(() => {
    setValue("uk.backgroundImage", bannerImage);
    setValue("en.backgroundImage", bannerImage);
  }, [bannerImage, setValue]);

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

      <FormImg src={bannerImg} file={bannerFile} onFileChange={onBannerFileChange} onRemove={onBannerRemove} />

      <div className="grid grid-cols-2 gap-4">
        <FormField name="uk.primaryButton.text" label="primaryButtonTextUK " />
        <FormField name="en.primaryButton.text" label="primaryButtonTextEn " />
      </div>

      <Button variant="primary" type="submit" disabled={!isValid}>
        Зберегти
      </Button>
      <Button variant="outline" type="reset" onClick={() => reset(data)}>
        Скасувати
      </Button>
    </>
  );
};
