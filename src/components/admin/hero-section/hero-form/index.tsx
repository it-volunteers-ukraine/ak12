import { useFormContext } from "react-hook-form";

import { Button } from "@/components/button";
import { FormImg, FormField } from "@/components/form-elements";

import { AdminData } from "../config";

interface IHeroForm {
  data: AdminData;
  isValid: boolean;
}

export const HeroForm = ({ data, isValid }: IHeroForm) => {
  const { reset } = useFormContext();

  const bannerImg = data.uk?.backgroundImage || data.en?.backgroundImage;

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
      <FormImg src={bannerImg} />
      <FormField name="uk.backgroundImage" placeholder="https://example.com/image.jpg" label="backgroundImage" />
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
