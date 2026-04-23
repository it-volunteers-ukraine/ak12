"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { showMessage } from "@/components/toastify";
import { updateContract1824MultiLangAction } from "@/actions/contract-18-24";
import { deleteImageAction, uploadImageAction } from "@/actions/admin/upload-image.actions";

import { WrapperWithModal } from "..";
import { Contract1824Form } from "./contract-18-24-form/inde";
import { AdminData, adminSchema, IContract1824Section } from "./config";

export const Contract1824Section = ({ data }: IContract1824Section) => {
  const router = useRouter();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

  const handleSubmit = async (values: AdminData) => {
    let uploadedImagePublicId: string | null = null;

    try {
      const existingBackgroundImage =
        data.uk?.imgContent.backgroundImage || data.en?.imgContent.backgroundImage || null;
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
          contact: {
            ...values.en?.contact,
            number: values.uk?.contact?.number,
          },
        },
      };

      const res = await updateContract1824MultiLangAction(enrichedValues);

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
          console.error("Не вдалося видалити попереднє зображення hero:", deleteResult.error);
        }
      }

      showMessage.success("Дані успішно оновилися!");
      setBannerFile(null);
      setRemoveCurrentImage(false);
      router.refresh();

      return res;
    } catch (error) {
      if (uploadedImagePublicId) {
        await deleteImageAction(uploadedImagePublicId);
      }

      console.error("Hero submit failed:", error);
      showMessage.error("Не вдалося оновити дані");

      return {
        success: false,
        error: "Internal Server Error",
      };
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
    <WrapperWithModal
      key={
        data.uk?.imgContent?.backgroundImage?.secureUrl ||
        data.en?.imgContent?.backgroundImage?.secureUrl ||
        "hero-empty-image"
      }
      formConfig={{
        data,
        type: "contract1824",
        schema: adminSchema,
      }}
      onSubmit={handleSubmit}
    >
      {(status) => (
        <Contract1824Form
          data={data}
          bannerFile={bannerFile}
          isValid={status.isValid}
          onBannerRemove={handleBannerRemove}
          removeCurrentImage={removeCurrentImage}
          onBannerFileChange={handleBannerFileChange}
        />
      )}
    </WrapperWithModal>
  );
};
