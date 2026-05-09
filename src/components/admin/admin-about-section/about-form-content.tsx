"use client";

import { useMemo, useEffect } from "react";

import { useFieldArray, useFormContext } from "react-hook-form";

import { FormBuilder } from "@/lib/form-builder";
import { AdminDataMap } from "@/lib/admin/admin-types";
import { createAboutFormBuilderConfig } from "@/lib/admin/configs/about.config";

import { EMPTY_GALLERY_ITEM } from "./gallery.config";

type AdminData = AdminDataMap["about"];
interface AboutFormContentProps {
  data: AdminData;
  onReset: () => void;
  removedImageFieldIds: Set<string>;
  galleryFiles: Record<string, File | null>;
  onGalleryItemRemove: (index: number) => void;
  onGalleryImageRemove: (fieldId: string) => void;
  onGalleryFieldIdsChange: (fieldIds: string[]) => void;
  onGalleryFileChange: (fieldId: string, file: File | null) => void;
}
type AboutFormShape = {
  en: {
    content: {
      gallery: Array<{
        secureUrl?: string | null;
      }>;
    };
  };
  uk: {
    content: {
      gallery: Array<{
        secureUrl?: string | null;
      }>;
    };
  };
};

export const AboutFormContent = ({
  data,
  onReset,
  galleryFiles,
  onGalleryFileChange,
  onGalleryItemRemove,
  onGalleryImageRemove,
  removedImageFieldIds,
  onGalleryFieldIdsChange,
}: AboutFormContentProps) => {
  const { control, watch } = useFormContext<AboutFormShape>();
  const ukGalleryArray = useFieldArray({
    control,
    name: "uk.content.gallery",
  });
  const enGalleryArray = useFieldArray({
    control,
    name: "en.content.gallery",
  });

  const watchedUkGallery = watch("uk.content.gallery") ?? [];
  const galleryLength = ukGalleryArray.fields.length;
  const galleryFieldIdsByIndex = useMemo(
    () => Object.fromEntries(ukGalleryArray.fields.map((field, index) => [index, field.id])) as Record<number, string>,
    [ukGalleryArray.fields],
  );

  const gallerySrcByIndex = useMemo(
    () =>
      Object.fromEntries((watchedUkGallery ?? []).map((item, index) => [index, item?.secureUrl ?? null])) as Record<
        number,
        string | null
      >,
    [watchedUkGallery],
  );

  useEffect(() => {
    onGalleryFieldIdsChange(ukGalleryArray.fields.map((field) => field.id));
  }, [onGalleryFieldIdsChange, ukGalleryArray.fields]);

  const handleClick = () => {
    const currentLength = ukGalleryArray.fields.length;

    const isPreviewLength = currentLength >= 9;

    const createItem = (langText: string) => ({
      ...EMPTY_GALLERY_ITEM,
      text: isPreviewLength ? langText : "",
    });

    ukGalleryArray.append(createItem(`Зображення №${currentLength + 1}`));
    enGalleryArray.append(createItem(`Image №${currentLength + 1}`));
  };

  return (
    <div className="space-y-5">
      <FormBuilder
        data={data}
        onReset={onReset}
        galleryFiles={galleryFiles}
        addNewElementForArray={true}
        gallerySrcByIndex={gallerySrcByIndex}
        addNewElementHandleClick={handleClick}
        onGalleryRemove={onGalleryImageRemove}
        onGalleryFileChange={onGalleryFileChange}
        removedImageFieldIds={removedImageFieldIds}
        galleryFieldIdsByIndex={galleryFieldIdsByIndex}
        config={createAboutFormBuilderConfig(galleryLength)}
        onGalleryItemRemove={(index) => {
          ukGalleryArray.remove(index);
          enGalleryArray.remove(index);
          onGalleryItemRemove(index);
        }}
      />
    </div>
  );
};
