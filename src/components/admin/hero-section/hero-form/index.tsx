import { useFormContext } from "react-hook-form";

import { Button } from "@/components/button";
import { FormImg, FormField } from "@/components/form-elements";

import { AdminData } from "../config";
import { En, Uk } from "../../../../../public/icons";

interface IHeroForm {
  data: AdminData;
  isValid: boolean;
}

export const HeroForm = ({ data, isValid }: IHeroForm) => {
  const { reset } = useFormContext();

  const bannerImg = data.uk?.backgroundImage?.secureUrl || data.en?.backgroundImage?.secureUrl;

  return (
    <>
      <div>
        <Button variant="primary" type="submit" disabled={!isValid}>
          Зберегти
        </Button>
        <Button variant="outline" type="reset" onClick={() => reset(data)}>
          Скасувати
        </Button>
      </div>
      <div>
        <div>
          <h3>Фото на сайті</h3>
          <FormImg src={bannerImg} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h3>Текстовий контент українською</h3>
            <Uk width={42} height={32} />
          </div>
          <FormField name="uk.title" label="titleUk" />
          <FormField name="uk.subtitle" label="subtitleUk" />
        </div>
        <div>
          <div className="flex justify-between">
            <h3>Текстовий контент англійською</h3>
            <En width={42} height={32} />
          </div>
          <FormField name="en.title" label="titleEn" />
          <FormField name="en.subtitle" label="subtitleEn" />
        </div>
      </div>

      <div>
        <div>
          <h3>Редагування кнопки</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField name="uk.buttonTitle" label="primaryButtonTextUK " />
          <FormField name="en.buttonTitle" label="primaryButtonTextEn " />
        </div>
      </div>
      <FormField
        name="uk.backgroundImage.secureUrl"
        placeholder="https://example.com/image.jpg"
        label="backgroundImage"
      />
      <div>
        <h3>Редагування додаткового контенту</h3>
        <div>
          <FormField name="uk.hiringChance" label="hiringChanceUK " />
          <FormField name="en.hiringChance" label="hiringChanceEn " />
        </div>
        <div>
          <FormField name="uk.majors" label="majorsUK " />
          <FormField name="en.majors" label="majorsEn " />
        </div>
        <div>
          <FormField name="uk.support" label="supportUK " />
          <FormField name="en.support" label="supportEn " />
        </div>
      </div>
    </>
  );
};
