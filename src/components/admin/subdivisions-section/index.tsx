"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showMessage } from "@/components/toastify";
import { uploadImageAction, deleteImageAction } from "@/actions/admin/upload-image.actions";
import { createSubdivision, updateSubdivision } from "@/actions/subdivisions";
import { StoredImage } from "@/lib/admin/upload-image.service";
import { WrapperWithModal } from "../form-wrapper-with-modal";
import { SubdivisionForm } from "./subdivision-form";
import { adminSchema, AdminData, ISubdivisionSection } from "./config";

export const SubdivisionSection = ({ data, onSuccess }: ISubdivisionSection) => {
  const router = useRouter();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [hoverImageFile, setHoverImageFile] = useState<File | null>(null);
  const [removeHoverImage, setRemoveHoverImage] = useState(false);

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

      const ukPayload = {
        name: values.uk.name,
        slug: values.uk.slug,
        description: values.uk.description,
        hoverName: values.uk.hoverName,
        hoverDescription: values.uk.hoverDescription,
        siteUrl: values.uk.siteUrl,
        sortOrder: values.uk.sortOrder,
        languageCode: "uk" as const,
        languageId: data?.uk?.languageId ?? "",
        imageUrl: nextImage,
        hoverImageUrl: nextHoverImage,
        updatedAt: new Date().toISOString(),
        isActive: true
      };

      const enPayload = {
        name: values.en.name,
        slug: values.uk.slug, // en slug = uk slug
        description: values.en.description,
        hoverName: values.en.hoverName,
        hoverDescription: values.en.hoverDescription,
        siteUrl: values.en.siteUrl,
        sortOrder: values.uk.sortOrder,
        languageCode: "en" as const,
        languageId: data?.en?.languageId ?? "",
        imageUrl: nextImage,
        hoverImageUrl: nextHoverImage,
        updatedAt: new Date().toISOString(),
        isActive: true
      };

      if (data?.uk?.id) {
        await updateSubdivision(data.uk.id, ukPayload);

        if (data?.en?.id) {
          await updateSubdivision(data.en.id, enPayload);
        }
      } else {
        await createSubdivision(ukPayload);
        await createSubdivision(enPayload);
      }

      if (oldImage?.publicId && (imageFile || removeImage)) {
        await deleteImageAction(oldImage.publicId);
      }

      if (oldHoverImage?.publicId && (hoverImageFile || removeHoverImage)) {
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

  return (
    <WrapperWithModal
      key={data?.uk?.imageUrl?.secureUrl || "subdivision-empty"}
      formConfig={{
        data: formData,
        type: "subdivision",
        schema: adminSchema,
      }}
      onSubmit={handleSubmit}
    >
      {(status) => (
        <SubdivisionForm
          data={data}
          isValid={status.isValid}
          imageFile={imageFile}
          removeImage={removeImage}
          onImageChange={(f) => { setImageFile(f); setRemoveImage(false); }}
          onImageRemove={() => { setImageFile(null); setRemoveImage(true); }}
          hoverImageFile={hoverImageFile}
          removeHoverImage={removeHoverImage}
          onHoverImageChange={(f) => { setHoverImageFile(f); setRemoveHoverImage(false); }}
          onHoverImageRemove={() => { setHoverImageFile(null); setRemoveHoverImage(true); }}
        />
      )}
    </WrapperWithModal>
  );
};