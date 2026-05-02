"use client";

import z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { FormWrapper } from "../form";
import { SECTION_KEYS } from "@/constants";
import { FormBuilder } from "@/lib/form-builder";
import { showMessage } from "@/components/toastify";
import { AdminDataMap } from "@/lib/admin/admin-types";
import { ADMIN_SCHEMAS } from "@/lib/admin/admin-schemas";
import { ConfirmModal } from "@/components/connfirm-modal";
import { updateContentMultiLang } from "@/actions/content";
import { headerFooterFormBuilderConfig } from "@/lib/admin/configs/headerFooter.config";
import { deleteImageAction, uploadImageAction } from "@/actions/admin/upload-image.actions";

type FormValues = z.infer<typeof adminSchema>;
type AdminData = AdminDataMap["header-footer"];

interface IHeaderSection {
  data: AdminData;
}

const adminSchema = ADMIN_SCHEMAS["header-footer"];

export const HeaderFooterSection = ({ data }: IHeaderSection) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [pendingData, setPendingData] = useState<FormValues | null>(null);

  const existingLogoImage = data.uk?.header.logoImg || data.en?.header.logoImg || null;

  const handleSubmit = async (values: FormValues) => {
    let uploadedImagePublicId: string | null = null;

    try {
      const oldImagePublicId = existingLogoImage?.publicId ?? null;
      let nextBackgroundImage = existingLogoImage;

      if (removeCurrentImage) {
        nextBackgroundImage = null;
      }

      if (logoFile) {
        const uploadResult = await uploadImageAction({
          file: logoFile,
          fileName: "header-footer",
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
          header: {
            ...values.uk.header,
            logoImg: nextBackgroundImage,
          },
          footer: {
            ...values.uk.footer,
            logoImg: nextBackgroundImage,
          },
        },
        en: {
          ...values.en,
          header: {
            ...values.en.header,
            logoImg: nextBackgroundImage,
          },
          footer: {
            ...values.en.footer,
            logoImg: nextBackgroundImage,
          },
        },
      };

      const res = await updateContentMultiLang(SECTION_KEYS.HEADER, enrichedValues);

      if (!res.success) {
        if (uploadedImagePublicId) {
          await deleteImageAction(uploadedImagePublicId);
        }

        showMessage.error("Не вдалося оновити дані");

        return res;
      }

      const shouldDeleteOldImage =
        oldImagePublicId &&
        ((removeCurrentImage && !logoFile) || (logoFile && nextBackgroundImage?.publicId !== oldImagePublicId));

      if (shouldDeleteOldImage) {
        const deleteResult = await deleteImageAction(oldImagePublicId);

        if (!deleteResult.success) {
          showMessage.warn("Контент оновлено, але старе зображення не вдалося видалити зі сховища");
        }
      }

      showMessage.success("Дані успішно оновилися!");
      setLogoFile(null);
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

  function handleLogoFileChange(file: File | null) {
    setLogoFile(file);
    setRemoveCurrentImage(false);
  }

  function handleBannerRemove() {
    setLogoFile(null);
    setRemoveCurrentImage(true);
  }

  function handleFormReset() {
    setLogoFile(null);
    setRemoveCurrentImage(false);
  }

  return (
    <>
      <FormWrapper<FormValues>
        schema={adminSchema}
        initialValues={data}
        onSubmit={onFormSubmit}
        key={data.uk?.header.logoText || data.en?.header.logoText || "header-footer"}
      >
        <FormBuilder
          data={data}
          imageFile={logoFile}
          onReset={handleFormReset}
          onImageRemove={handleBannerRemove}
          bannerSrc={existingLogoImage}
          onImageChange={handleLogoFileChange}
          config={headerFooterFormBuilderConfig(data)}
          isImageMarkedForRemoval={removeCurrentImage}
        />
      </FormWrapper>
      <ConfirmModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        title="Підтвердіть зміни"
        handleConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
        content="Ви впевнені, що хочете зберегти зміни в секції Шапка сайту?"
      />
    </>
  );
};
