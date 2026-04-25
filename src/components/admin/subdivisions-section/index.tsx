"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showMessage } from "@/components/toastify";
import { ConfirmModal } from "@/components/connfirm-modal";
import { uploadImageAction, deleteImageAction } from "@/actions/admin/upload-image.actions";
import { createSubdivision, updateSubdivision } from "@/actions/subdivisions";
import { StoredImage } from "@/lib/admin/upload-image.service";
import { FormWrapper } from "../form";
import { SubdivisionForm } from "./subdivision-form";
import { adminSchema, AdminData, ISubdivisionSection } from "./config";

export const SubdivisionSection = ({ data, onSuccess }: ISubdivisionSection) => {
  const router = useRouter();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [hoverImageFile, setHoverImageFile] = useState<File | null>(null);
  const [removeHoverImage, setRemoveHoverImage] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingData, setPendingData] = useState<AdminData | null>(null);

  const handleSubmit = async (values: AdminData) => {
    let uploadedImagePublicId: string | null = null;
    let uploadedHoverPublicId: string | null = null;

    try {
      const oldImage = data?.uk?.imageUrl || data?.en?.imageUrl || null;
      const oldHoverImage = data?.uk?.hoverImageUrl || data?.en?.hoverImageUrl || null;

      let nextImage: StoredImage | null = removeImage ? null : (oldImage ?? null);

      if (imageFile) {
        const result = await uploadImageAction({
          file: imageFile,
          fileName: `subdivision-${values.uk.slug}`,
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        nextImage = result.data;
        uploadedImagePublicId = result.data.publicId;
      }

      let nextHoverImage: StoredImage | null = removeHoverImage ? null : (oldHoverImage ?? null);

      if (hoverImageFile) {
        const result = await uploadImageAction({
          file: hoverImageFile,
          fileName: `subdivision-hover-${values.uk.slug}`,
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        nextHoverImage = result.data;
        uploadedHoverPublicId = result.data.publicId;
      }

      // buildPayload всередині handleSubmit — має доступ до data з closure
      const buildPayload = (lang: "uk" | "en") => ({
        name: values[lang].name,
        slug: values.uk.slug,
        description: values[lang].description,
        hoverName: values[lang].hoverName,
        hoverDescription: values[lang].hoverDescription,
        siteUrl: values[lang].siteUrl,
        isActive: values.uk.isActive ?? true,
        sortOrder: values.uk.sortOrder,
        languageCode: lang as "uk" | "en",
        languageId: lang === "uk"
          ? (data?.uk?.languageId ?? "")
          : (data?.en?.languageId ?? ""),
        imageUrl: nextImage,
        hoverImageUrl: nextHoverImage,
      });

      const ukPayload = buildPayload("uk");
      const enPayload = buildPayload("en");

      if (data?.uk?.id) {
        await updateSubdivision(data.uk.id, ukPayload);

        if (data?.en?.id) {
          await updateSubdivision(data.en.id, enPayload);
        }
      } else {
        await createSubdivision(ukPayload);
        await createSubdivision(enPayload);
      }

      const imagePublicIdChanged = nextImage?.publicId !== oldImage?.publicId;

if (oldImage?.publicId && (removeImage || (imageFile && imagePublicIdChanged))) {
  await deleteImageAction(oldImage.publicId);
}

const hoverPublicIdChanged = nextHoverImage?.publicId !== oldHoverImage?.publicId;

if (oldHoverImage?.publicId && (removeHoverImage || (hoverImageFile && hoverPublicIdChanged))) {
  await deleteImageAction(oldHoverImage.publicId);
}

      showMessage.success("Дані успішно збережено!");
      setImageFile(null);
      setHoverImageFile(null);
      setRemoveImage(false);
      setRemoveHoverImage(false);
      onSuccess?.();
      router.refresh();

      return { success: true };
    } catch (error) {
      if (uploadedImagePublicId) {
        await deleteImageAction(uploadedImagePublicId);
      }

      if (uploadedHoverPublicId) {
        await deleteImageAction(uploadedHoverPublicId);
      }
      showMessage.error("Не вдалося зберегти дані");

      return { success: false, error: String(error) };
    }
  };

  const empty = {
    name: "",
    slug: "",
    description: "",
    hoverName: null,
    hoverDescription: null,
    siteUrl: null,
    imageUrl: null,
    hoverImageUrl: null,
    isActive: true,
    sortOrder: 0,
  };

  const formData: AdminData = data ?? { uk: empty, en: empty };

  const handleConfirm = () => {
    setIsModalOpen(false);
    if (pendingData) {
      setIsLoading(true);
      handleSubmit(pendingData).finally(() => {
        setIsLoading(false);
        setPendingData(null);
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPendingData(null);
  };

  const onFormSubmit = async (values: AdminData) => {
    setPendingData(values);
    setIsModalOpen(true);
  };

  return (
    <>
      <FormWrapper
        key={data?.uk?.id || "subdivision-new"}
        schema={adminSchema}
        initialValues={formData}
        onSubmit={onFormSubmit}
      >
        {(methods) => {
          const { isValid } = methods.formState;
          
          return (
            <SubdivisionForm
              data={data}
              isValid={isValid}
              imageFile={imageFile}
              removeImage={removeImage}
              onImageChange={(f) => { setImageFile(f); setRemoveImage(false); }}
              onImageRemove={() => { setImageFile(null); setRemoveImage(true); }}
              hoverImageFile={hoverImageFile}
              removeHoverImage={removeHoverImage}
              onHoverImageChange={(f) => { setHoverImageFile(f); setRemoveHoverImage(false); }}
              onHoverImageRemove={() => { setHoverImageFile(null); setRemoveHoverImage(true); }}
            />
          );
        }}
      </FormWrapper>

      <ConfirmModal
        onClose={handleCancel}
        isLoading={isLoading}
        isOpen={isModalOpen}
        handleConfirm={handleConfirm}
      />
    </>
  );
};