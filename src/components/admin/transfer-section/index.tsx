"use client";

import { useState } from "react";

import z from "zod";
import { useRouter } from "next/navigation";

import { FormBuilder } from "@/lib/form-builder";
import { showMessage } from "@/components/toastify";
import { AdminDataMap } from "@/lib/admin/admin-types";
import { ADMIN_SCHEMAS } from "@/lib/admin/admin-schemas";
import { ConfirmModal } from "@/components/connfirm-modal";
import { updateTransferMultiLangAction } from "@/actions/transfer";
import { transferConfig } from "@/lib/admin/configs/transfer.config";
import { deleteImageAction, uploadImageAction } from "@/actions/admin/upload-image.actions";

import { FormWrapper } from "../form";

type FormValues = z.infer<typeof adminSchema>;
type AdminData = AdminDataMap["transfer"];
interface ITransferSection {
  data: AdminData;
}

const adminSchema = ADMIN_SCHEMAS["transfer"];

export const TransferSection = ({ data }: ITransferSection) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [pendingData, setPendingData] = useState<FormValues | null>(null);

  const existingBackgroundImage = data.uk?.backgroundImage || data.en?.backgroundImage || null;

  const handleSubmit = async (values: FormValues) => {
    let uploadedImagePublicId: string | null = null;

    try {
      const oldImagePublicId = existingBackgroundImage?.publicId ?? null;
      let nextBackgroundImage = existingBackgroundImage;

      if (removeCurrentImage) {
        nextBackgroundImage = null;
      }

      if (bannerFile) {
        const uploadResult = await uploadImageAction({
          file: bannerFile,
          fileName: "transfer-background",
        });

        if (!uploadResult.success) {
          throw new Error(uploadResult.error);
        }

        nextBackgroundImage = uploadResult.data;
        uploadedImagePublicId = uploadResult.data?.publicId ?? null;
      }

      const enrichedValues: FormValues = {
        ...values,
        uk: {
          ...values.uk,

          backgroundImage: nextBackgroundImage,
        },
        en: {
          ...values.en,

          backgroundImage: nextBackgroundImage,
        },
      };

      const res = await updateTransferMultiLangAction(enrichedValues);

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
          showMessage.warn("Контент оновлено, але старе зображення не вдалося видалити зі сховища");
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

  function handleFormReset() {
    setBannerFile(null);
    setRemoveCurrentImage(false);
  }

  return (
    <>
      <FormWrapper<FormValues>
        schema={adminSchema}
        initialValues={data}
        onSubmit={onFormSubmit}
        key={data.uk?.backgroundImage?.secureUrl || data.en?.backgroundImage?.secureUrl || "transfer"}
      >
        <FormBuilder
          data={data}
          imageFile={bannerFile}
          config={transferConfig}
          onReset={handleFormReset}
          onImageRemove={handleBannerRemove}
          bannerSrc={existingBackgroundImage}
          onImageChange={handleBannerFileChange}
          isImageMarkedForRemoval={removeCurrentImage}
        />
      </FormWrapper>

      <ConfirmModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        title="Підтвердіть зміни"
        handleConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
        content="Ви впевнені, що хочете зберегти зміни в секції Переведення?"
      />
    </>
  );
};
