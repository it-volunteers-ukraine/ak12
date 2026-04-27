"use client";

import { useState } from "react";

import z from "zod";
import { useRouter } from "next/navigation";

import { FormBuilder } from "@/lib/form-builder";
import { showMessage } from "@/components/toastify";
import { AdminDataMap } from "@/lib/admin/admin-types";
import { ADMIN_SCHEMAS } from "@/lib/admin/admin-schemas";
import { ConfirmModal } from "@/components/connfirm-modal";
import { updateContract1824MultiLangAction } from "@/actions/contract-18-24";
import { contract1824FormBuilderConfig } from "@/lib/admin/configs/contract1824.config";
import { deleteImageAction, uploadImageAction } from "@/actions/admin/upload-image.actions";

import { FormWrapper } from "../form";

type FormValues = z.infer<typeof adminSchema>;
type AdminData = AdminDataMap["contract-18-24"];
interface IContract1824Section {
  data: AdminData;
}

const adminSchema = ADMIN_SCHEMAS["contract-18-24"];

export const Contract1824Section = ({ data }: IContract1824Section) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [pendingData, setPendingData] = useState<FormValues | null>(null);

  const formBuilderData = {
    ...data,
    uk: {
      ...data.uk,
      backgroundImage: data.uk?.imgContent?.backgroundImage,
    },
    en: {
      ...data.en,
      backgroundImage: data.en?.imgContent?.backgroundImage,
    },
  };

  const handleSubmit = async (values: FormValues) => {
    let uploadedImagePublicId: string | null = null;

    try {
      const existingBackgroundImage =
        data.uk?.imgContent?.backgroundImage || data.en?.imgContent?.backgroundImage || null;
      const oldImagePublicId = existingBackgroundImage?.publicId ?? null;
      let nextBackgroundImage = existingBackgroundImage;

      if (removeCurrentImage) {
        nextBackgroundImage = null;
      }

      if (bannerFile) {
        const uploadResult = await uploadImageAction({
          file: bannerFile,
          fileName: "contract-18-24-background",
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
          imgContent: {
            ...values.uk.imgContent,
            backgroundImage: nextBackgroundImage,
          },
        },
        en: {
          ...values.en,
          imgContent: {
            ...values.en.imgContent,
            backgroundImage: nextBackgroundImage,
          },
          contact: {
            ...values.en.contact,
            number: values.uk.contact.number,
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
        await deleteImageAction(oldImagePublicId);
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
          data={formBuilderData}
          imageFile={bannerFile}
          onImageRemove={handleBannerRemove}
          onImageChange={handleBannerFileChange}
          config={contract1824FormBuilderConfig}
        />
      </FormWrapper>

      <ConfirmModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        title="Підтвердіть зміни"
        handleConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
        content="Ви впевнені, що хочете зберегти зміни в секції Контракт 18-24?"
      />
    </>
  );
};
