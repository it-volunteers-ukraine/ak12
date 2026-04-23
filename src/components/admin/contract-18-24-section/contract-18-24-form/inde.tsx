"use client";

import { useEffect } from "react";

import { useFormContext } from "react-hook-form";

import { FormImg, FormField } from "@/components/form-elements";

import { AdminData } from "../config";
import { LANGUAGES, buttonLabels, textContentLabels } from "./config";
import { BtnGroup, FieldWithIcon, LocaleContentGroup } from "../../admin-form-elements";

interface IContract1824Form {
  data: AdminData;
  isValid: boolean;
  bannerFile: File | null;
  onBannerRemove: () => void;
  removeCurrentImage: boolean;
  onBannerFileChange: (file: File | null) => void;
}

export const Contract1824Form = ({
  data,
  isValid,
  bannerFile,
  onBannerRemove,
  removeCurrentImage,
  onBannerFileChange,
}: IContract1824Form) => {
  const { setValue, reset } = useFormContext();
  const bannerImage = removeCurrentImage
    ? null
    : data.uk?.imgContent?.backgroundImage || data.en?.imgContent?.backgroundImage || null;
  const bannerImg = bannerImage?.secureUrl || null;

  useEffect(() => {
    setValue("uk.backgroundImage", bannerImage);
    setValue("en.backgroundImage", bannerImage);
  }, [bannerImage, setValue]);

  return (
    <>
      <BtnGroup
        isValid={isValid}
        onReset={() => reset(data)}
        submitText="Зберегти зміни"
        resetText="Скасувати правки"
      />

      <div className="mb-10 flex w-full items-stretch justify-between gap-6">
        <FormImg
          src={bannerImg}
          file={bannerFile}
          label="Фото на сайті"
          onRemove={onBannerRemove}
          onFileChange={onBannerFileChange}
        />

        {LANGUAGES.map(({ id, icon: Icon }) => (
          <LocaleContentGroup
            icon={Icon}
            locale={id}
            iconWidth={42}
            iconHeight={32}
            label={textContentLabels[id]}
            key={`${id}-${textContentLabels[id]}`}
          />
        ))}
      </div>

      <div className="mb-10">
        <h3 className="mb-4 text-xl font-medium">Редагування кнопки</h3>

        <div className="grid grid-cols-2 gap-12 rounded-2xl border border-gray-300 bg-[#F8F9FA]/80 px-6 pt-10 pb-4">
          {LANGUAGES.map(({ id, icon: Icon }) => (
            <FieldWithIcon
              icon={Icon}
              locale={id}
              iconWidth={22}
              iconHeight={22}
              basePath="buttonTitle"
              key={`${id} buttonTitle`}
              label={buttonLabels[id]}
              iconWrapperClassName="h-4 w-4 self-end"
            />
          ))}
        </div>
      </div>

      <>
        <h3 className="mb-4 text-xl font-medium">Редагування додаткового контенту</h3>
        <div className="flex justify-between gap-6 rounded-2xl border border-gray-300 bg-[#F8F9FA]/80 px-6 pt-10 pb-9">
          <div className="flex-1">
            <h4>Гарантія посади</h4>
            {LANGUAGES.map(({ id, icon: Icon }) => (
              <FieldWithIcon
                icon={Icon}
                locale={id}
                iconWidth={22}
                iconHeight={22}
                basePath="hiringChance.title"
                key={`${id} hiringChance.title`}
                iconWrapperClassName="h-4 w-4 self-end"
              />
            ))}
            <FormField name="uk.hiringChance.value" />
          </div>

          <div className="flex-1">
            <h4>Спеціальності</h4>

            {LANGUAGES.map(({ id, icon: Icon }) => (
              <FieldWithIcon
                icon={Icon}
                locale={id}
                iconWidth={22}
                iconHeight={22}
                basePath="majors.title"
                key={`${id} majors.title`}
                iconWrapperClassName="h-4 w-4 self-end"
              />
            ))}
            <FormField name="uk.majors.value" />
          </div>

          <div className="flex-1">
            <h4>Підтримка</h4>

            {LANGUAGES.map(({ id, icon: Icon }) => (
              <FieldWithIcon
                icon={Icon}
                locale={id}
                iconWidth={22}
                iconHeight={22}
                basePath="support.title"
                key={`${id} support.title`}
                iconWrapperClassName="h-4 w-4 self-end"
              />
            ))}
            <FormField name="uk.support.value" />
          </div>
        </div>
      </>
    </>
  );
};
