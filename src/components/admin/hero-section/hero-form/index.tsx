"use client";

import { useEffect } from "react";

import { useFormContext } from "react-hook-form";

import { Button } from "@/components/button";
import { FormImg, FormField } from "@/components/form-elements";

import { getStyles } from "./styles";
import { AdminData } from "../config";
import { En, Uk } from "../../../../../public/icons";

interface IHeroForm {
  data: AdminData;
  isValid: boolean;
  bannerFile: File | null;
  onBannerRemove: () => void;
  removeCurrentImage: boolean;
  onBannerFileChange: (file: File | null) => void;
}

export const HeroForm = ({
  data,
  isValid,
  bannerFile,
  onBannerRemove,
  removeCurrentImage,
  onBannerFileChange,
}: IHeroForm) => {
  const { setValue, reset } = useFormContext();
  const bannerImage = removeCurrentImage ? null : data.uk?.backgroundImage || data.en?.backgroundImage || null;
  const bannerImg = bannerImage?.secureUrl || null;

  useEffect(() => {
    setValue("uk.backgroundImage", bannerImage);
    setValue("en.backgroundImage", bannerImage);
  }, [bannerImage, setValue]);

  const { textContentWrapper, iconWrapper } = getStyles();

  return (
    <>
      <div className="mb-8 flex justify-end gap-6">
        <Button variant="primary" type="submit" disabled={!isValid}>
          Зберегти зміни
        </Button>
        <Button variant="outline" type="reset" onClick={() => reset(data)}>
          Скасувати правки
        </Button>
      </div>

      <div className="mb-10 flex w-full items-stretch justify-between gap-6">
        <div>
          <FormImg
            src={bannerImg}
            file={bannerFile}
            label="Фото на сайті"
            onRemove={onBannerRemove}
            onFileChange={onBannerFileChange}
          />
        </div>

        <div className={textContentWrapper}>
          <div className="mb-4 flex justify-between">
            <h3 className="font-medium">Текстовий контент українською</h3>
            <div className={iconWrapper()}>
              <Uk width={42} height={32} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <FormField name="uk.title" label="Заголовок" />
            <FormField name="uk.subtitle" label="Підзаголовок" />
          </div>
        </div>

        <div className={textContentWrapper}>
          <div className="mb-4 flex justify-between">
            <h3 className="font-medium">Текстовий контент англійською</h3>
            <div className={iconWrapper()}>
              <En width={42} height={32} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <FormField name="en.title" label="Заголовок" />
            <FormField name="en.subtitle" label="Підзаголовок" />
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="mb-4 text-xl font-medium">Редагування кнопки</h3>

        <div className="grid grid-cols-2 gap-12 rounded-2xl border border-gray-300 bg-[#F8F9FA]/80 px-6 pt-10 pb-4">
          <div>
            {/*  //TODO: refactor to avoid code duplication */}
            <div className="mb-4 flex justify-between">
              <h4 className="text-sm">Текст кнопки українською</h4>
              <div className={iconWrapper("h-4 w-4")}>
                <Uk width={22} height={22} className="h-full w-full object-cover" />
              </div>
            </div>
            <FormField name="uk.buttonTitle" />
          </div>
          <div>
            <div className="mb-4 flex justify-between">
              <h4 className="text-sm">Текст кнопки англійською</h4>
              <div className={iconWrapper("h-4 w-4")}>
                <En width={22} height={22} className="object-cover" />
              </div>
            </div>

            <FormField name="en.buttonTitle" />
          </div>
        </div>
      </div>

      <>
        <h3 className="mb-4 text-xl font-medium">Редагування додаткового контенту</h3>
        <div className="flex justify-between gap-6 rounded-2xl border border-gray-300 bg-[#F8F9FA]/80 px-6 pt-10 pb-9">
          <div className="flex-1">
            <h4>Гарантія посади</h4>
            <div className="flex w-full flex-col">
              <div className={iconWrapper("h-4 w-4 self-end")}>
                <Uk width={22} height={22} className="h-full w-full object-cover" />
              </div>
              <FormField name="uk.hiringChance.title" />
            </div>
            <div className="flex w-full flex-col">
              <div className={iconWrapper("h-4 w-4 self-end")}>
                <En width={22} height={22} className="object-cover" />
              </div>
              <FormField name="en.hiringChance.title" />
            </div>
            <FormField name="uk.hiringChance.value" />
          </div>
          <div className="flex-1">
            <h4>Спеціальності</h4>
            <div className="flex w-full flex-col">
              <div className={iconWrapper("h-4 w-4 self-end")}>
                <Uk width={22} height={22} className="h-full w-full object-cover" />
              </div>
              <FormField name="uk.majors.title" />
            </div>
            <div className="flex w-full flex-col">
              <div className={iconWrapper("h-4 w-4 self-end")}>
                <En width={22} height={22} className="object-cover" />
              </div>
              <FormField name="en.majors.title" />
            </div>
            <FormField name="uk.majors.value" />
          </div>
          <div className="flex-1">
            <h4>Підтримка</h4>
            <div className="flex w-full flex-col">
              <div className={iconWrapper("h-4 w-4 self-end")}>
                <Uk width={22} height={22} className="h-full w-full object-cover" />
              </div>
              <FormField name="uk.support.title" />
            </div>
            <div className="flex w-full flex-col">
              <div className={iconWrapper("h-4 w-4 self-end")}>
                <En width={22} height={22} className="object-cover" />
              </div>
              <FormField name="en.support.title" />
            </div>
            <FormField name="uk.support.value" />
          </div>
        </div>
      </>
    </>
  );
};
