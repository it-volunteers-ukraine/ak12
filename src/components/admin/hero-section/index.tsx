"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/button";
import { logger } from "@/lib/logger";
import { showMessage } from "@/components/toastify";
import { AdminDataMap, ADMIN_SCHEMAS } from "@/lib/admin";
import { ConfirmModal } from "@/components/confirm-modal/ui";
import { updateHeroMultiLangAction } from "@/actions/hero/heroActions";
import { deleteImageAction, uploadImageAction } from "@/actions/admin/upload-image.actions";

import { FormWrapper } from "../form";
import { HeroForm } from "./hero-form";

type AdminData = AdminDataMap["hero"];
interface IHeroSection {
  data: AdminData;
}

const adminSchema = ADMIN_SCHEMAS.hero;

export const HeroSection = ({ data }: IHeroSection) => {
  const router = useRouter();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingData, setPendingData] = useState<AdminData | null>(null);

  const onFormSubmit = (values: AdminData) => {
    setPendingData(values);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingData) {
      return;
    }

    setIsLoading(true);

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
        ...pendingData,
        uk: {
          ...pendingData.uk,
          backgroundImage: nextBackgroundImage,
        },
        en: {
          ...pendingData.en,
          backgroundImage: nextBackgroundImage,
          support: {
            ...pendingData.en?.support,
            value: pendingData.uk?.support?.value,
          },
          majors: {
            ...pendingData.en?.majors,
            value: pendingData.uk?.majors?.value,
          },
          hiringChance: {
            ...pendingData.en?.hiringChance,
            value: pendingData.uk?.hiringChance?.value,
          },
        },
      };

      const res = await updateHeroMultiLangAction(enrichedValues);

      if (!res.success) {
        if (uploadedImagePublicId) {
          await deleteImageAction(uploadedImagePublicId);
        }

        showMessage.error("Не вдалося оновити дані");

        return;
      }

      const shouldDeleteOldImage =
        oldImagePublicId &&
        ((removeCurrentImage && !bannerFile) || (bannerFile && nextBackgroundImage?.publicId !== oldImagePublicId));

      if (shouldDeleteOldImage) {
        const deleteResult = await deleteImageAction(oldImagePublicId);

        if (!deleteResult.success) {
          logger.error(
            { error: deleteResult.error, publicId: oldImagePublicId },
            "Failed to delete old hero image"
          );
        }
      }

      showMessage.success("Дані успішно оновилися!");
      setBannerFile(null);
      setRemoveCurrentImage(false);
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      if (uploadedImagePublicId) {
        await deleteImageAction(uploadedImagePublicId);
      }

      logger.error({ error }, "Hero form submission failed");
      showMessage.error("Не вдалося оновити дані");
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
      <FormWrapper
        key={data.uk?.backgroundImage?.secureUrl || data.en?.backgroundImage?.secureUrl || "hero-empty-image"}
        formConfig={{
          data,
          type: "hero",
          schema: adminSchema,
        }}
        onSubmit={onFormSubmit}
      >
        {(status) => (
          <HeroForm
            data={data}
            bannerFile={bannerFile}
            isValid={status.isValid}
            onBannerRemove={handleBannerRemove}
            removeCurrentImage={removeCurrentImage}
            onBannerFileChange={handleBannerFileChange}
          />
        )}
      </FormWrapper>

      <ConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ConfirmModal.ModalTitle>Підтвердіть зміни</ConfirmModal.ModalTitle>
        <ConfirmModal.ModalContent>
          Ви впевнені, що хочете зберегти зміни в головній секції?
        </ConfirmModal.ModalContent>
        <ConfirmModal.ModalFooter>
          <Button
            type="button"
            variant="primary"
            isLoading={isLoading}
            onClick={handleConfirm}
            className="w-full rounded-full"
          >
            Так, зберегти
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => setIsModalOpen(false)}
            className="w-full rounded-full"
            disabled={isLoading}
          >
            Скасувати
          </Button>
        </ConfirmModal.ModalFooter>
      </ConfirmModal>
    </>
  );
};
