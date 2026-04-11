"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showMessage } from "@/components/toastify";
import { updateHeroMultiLangAction } from "@/actions/hero/heroActions";
import { deleteImageAction, uploadImageAction } from "@/actions/admin/upload-image.actions";
import { HeroForm } from "./hero-form";
import { WrapperWithModal } from "../form-wrapper-with-modal";
import { AdminData, adminSchema, IHeroSection } from "./config";

export const HeroSection = ({ data }: IHeroSection) => {
  const router = useRouter();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

  const handleSubmit = async (values: AdminData) => {
    try {
      const existingBackgroundImage =
        values.uk.backgroundImage || data.uk?.backgroundImage || data.en?.backgroundImage || null;

      let nextBackgroundImage = removeCurrentImage ? null : existingBackgroundImage;

      if (removeCurrentImage && existingBackgroundImage?.publicId) {
        const deleteResult = await deleteImageAction(existingBackgroundImage.publicId);

        if (!deleteResult.success) {
          throw new Error(deleteResult.error);
        }
      }

      if (bannerFile) {
        if (existingBackgroundImage?.publicId && !removeCurrentImage) {
          const deleteResult = await deleteImageAction(existingBackgroundImage.publicId);

          if (!deleteResult.success) {
            throw new Error(deleteResult.error);
          }
        }

        const uploadResult = await uploadImageAction({
          file: bannerFile,
          fileName: "hero-background",
        });

        if (!uploadResult.success) {
          throw new Error(uploadResult.error);
        }

        nextBackgroundImage = uploadResult.data;
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
        },
      };

      const res = await updateHeroMultiLangAction(enrichedValues);

      if (res.success) {
        showMessage.success("Дані успішно оновилися!");
        setBannerFile(null);
        setRemoveCurrentImage(false);
        router.refresh();
      } else {
        showMessage.error("Не вдалося оновити дані");
      }

      return res;
    } catch (error) {
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
      key={data.uk?.backgroundImage?.secureUrl || data.en?.backgroundImage?.secureUrl || "hero-empty-image"}
      formConfig={{
        data,
        type: "hero",
        schema: adminSchema,
      }}
      onSubmit={handleSubmit}
    >
      {(status) => (
        <HeroForm
          data={data}
          isValid={status.isValid}
          bannerFile={bannerFile}
          removeCurrentImage={removeCurrentImage}
          onBannerFileChange={handleBannerFileChange}
          onBannerRemove={handleBannerRemove}
        />
      )}
    </WrapperWithModal>
  );
};
