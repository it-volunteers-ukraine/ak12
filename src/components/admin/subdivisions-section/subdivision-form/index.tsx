"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormImg, FormField } from "@/components/form-elements";
import { BtnGroup } from "@/components/admin/admin-form-elements";
import { StoredImage } from "@/lib/admin/upload-image.service";
import { AdminData } from "../config";
import { LANGUAGES, textContentLabels } from "./config";

interface ISubdivisionForm {
  data?: AdminData;
  isValid: boolean;
  imageFile: File | null;
  removeImage: boolean;
  onImageChange: (file: File | null) => void;
  onImageRemove: () => void;
  hoverImageFile: File | null;
  removeHoverImage: boolean;
  onHoverImageChange: (file: File | null) => void;
  onHoverImageRemove: () => void;
}

export const SubdivisionForm = ({
  data,
  isValid,
  imageFile,
  removeImage,
  onImageChange,
  onImageRemove,
  hoverImageFile,
  removeHoverImage,
  onHoverImageChange,
  onHoverImageRemove,
}: ISubdivisionForm) => {
  const { setValue, reset } = useFormContext();

  const existingImage = data?.uk?.imageUrl || data?.en?.imageUrl || null;
  const existingHoverImage = data?.uk?.hoverImageUrl || data?.en?.hoverImageUrl || null;

  const currentImage: StoredImage | null = removeImage ? null : existingImage;
  const currentHoverImage: StoredImage | null = removeHoverImage ? null : existingHoverImage;

  useEffect(() => {
    setValue("uk.imageUrl", currentImage);
    setValue("en.imageUrl", currentImage);
  }, [currentImage, setValue]);

  useEffect(() => {
    setValue("uk.hoverImageUrl", currentHoverImage);
    setValue("en.hoverImageUrl", currentHoverImage);
  }, [currentHoverImage, setValue]);

  return (
    <>
      <BtnGroup
        isValid={isValid}
        onReset={() => reset(data)}
        submitText="Зберегти зміни"
        resetText="Скасувати правки"
      />

      {/* Фото */}
      <div className="mb-6 flex gap-6">
        <FormImg
          label="Фото на сайті (герб)"
          src={currentImage?.secureUrl ?? null}
          file={imageFile}
          onFileChange={onImageChange}
          onRemove={onImageRemove}
        />
        <FormImg
          label="Hover фото"
          src={currentHoverImage?.secureUrl ?? null}
          file={hoverImageFile}
          onFileChange={onHoverImageChange}
          onRemove={onHoverImageRemove}
        />
      </div>

      <div className="mb-6 flex gap-6">
        {LANGUAGES.map(({ id, icon: Icon }) => (
          <div
            key={id}
            className="flex-1 rounded-2xl border border-gray-300 bg-[#F8F9FA]/80 px-6 pt-6 pb-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium">{textContentLabels[id]}</h3>
              <Icon width={42} height={32} />
            </div>
            <div className="flex flex-col gap-4">
              <FormField name={`${id}.name`} label="Назва підрозділу *" />
              <FormField name={`${id}.slug`} label="Slug" />
              <FormField name={`${id}.siteUrl`} label="Посилання на сайт" />
              <FormField name={`${id}.hoverName`} label="Назва (hover)" />
              <FormField
                name={`${id}.description`}
                label="Короткий опис *"
                component="textarea"
                rows={3}
              />
              <FormField
                name={`${id}.hoverDescription`}
                label="Повний опис (hover)"
                component="textarea"
                rows={5}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-2xl border border-gray-300 bg-[#F8F9FA]/80 px-6 py-6">
        <h3 className="mb-4 font-medium">Налаштування</h3>
        <div className="flex gap-8">
          <FormField name="uk.sortOrder" label="Порядок" type="number" />
        </div>
      </div>
    </>
  );
};