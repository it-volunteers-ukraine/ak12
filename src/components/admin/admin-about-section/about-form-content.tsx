"use client";

import { useMemo } from "react";

import { useFieldArray, useFormContext } from "react-hook-form";

import { FormBuilder } from "@/lib/form-builder";
import { AdminDataMap } from "@/lib/admin/admin-types";
import { createAboutFormBuilderConfig } from "@/lib/admin/configs/about.config";

import { EMPTY_GALLERY_ITEM } from "./gallery.helpers";

type AdminData = AdminDataMap["about"];
interface AboutFormContentProps {
  data: AdminData;
  onReset: () => void;
  removedImageIndexes: Set<number>;
  galleryFiles: Record<number, File | null>;
  onGalleryItemRemove: (index: number) => void;
  onGalleryImageRemove: (index: number) => void;
  onGalleryFileChange: (index: number, file: File | null) => void;
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
  removedImageIndexes,
  onGalleryFileChange,
  onGalleryItemRemove,
  onGalleryImageRemove,
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

  const gallerySrcByIndex = useMemo(
    () =>
      Object.fromEntries((watchedUkGallery ?? []).map((item, index) => [index, item?.secureUrl ?? null])) as Record<
        number,
        string | null
      >,
    [watchedUkGallery],
  );

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            ukGalleryArray.append({ ...EMPTY_GALLERY_ITEM });
            enGalleryArray.append({ ...EMPTY_GALLERY_ITEM });
          }}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
        >
          Додати елемент галереї
        </button>
      </div>

      <FormBuilder
        data={data}
        onReset={onReset}
        galleryFiles={galleryFiles}
        gallerySrcByIndex={gallerySrcByIndex}
        onGalleryRemove={onGalleryImageRemove}
        removedImageIndexes={removedImageIndexes}
        onGalleryFileChange={onGalleryFileChange}
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
