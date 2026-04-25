"use client";

import { useState } from "react";

import z from "zod";
import { useRouter } from "next/navigation";

import { showMessage } from "@/components/toastify";
import { AdminDataMap } from "@/lib/admin/admin-types";
import { ADMIN_SCHEMAS } from "@/lib/admin/admin-schemas";
import { ConfirmModal } from "@/components/connfirm-modal";
import { updateHeroMultiLangAction } from "@/actions/hero/heroActions";
import { deleteImageAction, uploadImageAction } from "@/actions/admin/upload-image.actions";

import { FormWrapper } from "../form";
import { FormBuilder } from "@/lib/form-builder";
import { heroFormBuilderConfig } from "@/lib/admin/configs/hero.config";

type FormValues = z.infer<typeof adminSchema>;
type AdminData = AdminDataMap["hero"];
interface IHeroSection {
  data: AdminData;
}

export const adminSchema = ADMIN_SCHEMAS.hero;

export const HeroSection = ({ data }: IHeroSection) => {
  const router = useRouter();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingData, setPendingData] = useState<FormValues | null>(null);

  const handleSubmit = async (values: FormValues) => {
    let uploadedImagePublicId: string | null = null;

    try {
      const existingBackgroundImage = data.uk?.backgroundImage || data.en?.backgroundImage || null;
      const oldImagePublicId = existingBackgroundImage?.publicId ?? null;
      let nextBackgroundImage = existingBackgroundImage;

      if (removeCurrentImage) {
        nextBackgroundImage = null;
      }

      if (bannerFile) {
        const uploadResult = await uploadImageAction({
          file: bannerFile,
          fileName: "hero-background",
        });

        if (!uploadResult.success) {
          throw new Error(uploadResult.error);
        }

        nextBackgroundImage = uploadResult.data;
        uploadedImagePublicId = uploadResult.data?.publicId ?? null;
      }

      const enrichedValues = {
        ...values,
        uk: {
          ...values.uk,
          backgroundImage: nextBackgroundImage,
        },
        en: {
          ...values.en,
          backgroundImage: nextBackgroundImage,
          support: {
            ...values.en?.support,
            value: values.uk?.support?.value,
          },
          majors: {
            ...values.en?.majors,
            value: values.uk?.majors?.value,
          },
          hiringChance: {
            ...values.en?.hiringChance,
            value: values.uk?.hiringChance?.value,
          },
        },
      };

      const res = await updateHeroMultiLangAction(enrichedValues);

      if (!res.success) {
        if (uploadedImagePublicId) {
          await deleteImageAction(uploadedImagePublicId);
        }

        showMessage.error("Не вдалося оновити дані");

        return res;
      }

      const shouldDeleteOldImage =
        oldImagePublicId &&
        ((removeCurrentImage && !bannerFile) || (bannerFile && nextBackgroundImage?.publicId !== oldImagePublicId));

      if (shouldDeleteOldImage) {
        const deleteResult = await deleteImageAction(oldImagePublicId);

        if (!deleteResult.success) {
        }
      }

      showMessage.success("Дані успішно оновилися!");
      setBannerFile(null);
      setRemoveCurrentImage(false);
      router.refresh();

      return res;
    } catch {
      if (uploadedImagePublicId) {
        await deleteImageAction(uploadedImagePublicId);
      }

      showMessage.error("Не вдалося оновити дані");

      return {
        success: false,
        error: "Internal Server Error",
      };
    }
  };

  const onFormSubmit = (values: FormValues) => {
    setPendingData(values);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingData) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await handleSubmit(pendingData);

      if (result && !result.success) {
        return;
      }

      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  function handleBannerFileChange(file: File | null) {
    setBannerFile(file);
    setRemoveCurrentImage(false);
  }

  function handleBannerRemove() {
    setBannerFile(null);
    setRemoveCurrentImage(true);
  }

  return (
    <>
      <FormWrapper<FormValues> schema={adminSchema} initialValues={data} onSubmit={onFormSubmit}>
        <FormBuilder
          config={heroFormBuilderConfig}
          data={data}
          imageFile={bannerFile}
          onImageChange={handleBannerFileChange}
          onImageRemove={handleBannerRemove}
        />
      </FormWrapper>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Підтвердіть зміни"
        content="Ви впевнені, що хочете зберегти зміни в секції Hero?"
        isLoading={isLoading}
        onClose={() => setIsModalOpen(false)}
        handleConfirm={handleConfirm}
      />
    </>
  );
};
