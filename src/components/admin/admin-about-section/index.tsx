"use client";

import { useRef, useState, useTransition } from "react";

import z from "zod";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";

import { showMessage } from "@/components/toastify";
import { AdminDataMap } from "@/lib/admin/admin-types";
import { ADMIN_SCHEMAS } from "@/lib/admin/admin-schemas";
import { ConfirmModal } from "@/components/connfirm-modal";
import { updateAboutMultiLangAction } from "@/actions/about";
import { deleteImageAction, uploadImageAction } from "@/actions/admin/upload-image.actions";

import { FormWrapper } from "../form";
import { AboutFormContent } from "./about-form-content";
import { remapFilesAfterRemove, remapRemovedIndexesAfterRemove } from "./gallery.helpers";

type FormValues = z.infer<typeof adminSchema>;
type AdminData = AdminDataMap["about"];
type GalleryItem = NonNullable<FormValues["uk"]["content"]["gallery"][number]>;
type SubmitResult =
  | {
      success: true;
      nextEnGallery: Array<GalleryItem | null | undefined>;
      nextUkGallery: Array<GalleryItem | null | undefined>;
    }
  | { success: false; error: string };
interface IAboutSection {
  data: AdminData;
}

export const adminSchema = ADMIN_SCHEMAS.about;

export const AboutSectionAdmin = ({ data }: IAboutSection) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState<FormValues | null>(null);
  const formMethodsRef = useRef<UseFormReturn<FormValues> | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<Record<number, File | null>>({});
  const [removedImageIndexes, setRemovedImageIndexes] = useState<Set<number>>(new Set());
  const [isPending, startTransition] = useTransition();

  const handleGalleryFileChange = (index: number, file: File | null) => {
    setGalleryFiles((prev) => ({ ...prev, [index]: file }));
    setRemovedImageIndexes((prev) => {
      const next = new Set(prev);

      next.delete(index);

      return next;
    });
  };

  const handleGalleryImageRemove = (index: number) => {
    setGalleryFiles((prev) => ({ ...prev, [index]: null }));
    setRemovedImageIndexes((prev) => new Set(prev).add(index));
  };

  const handleGalleryItemRemove = (index: number) => {
    setGalleryFiles((prev) => remapFilesAfterRemove(prev, index));
    setRemovedImageIndexes((prev) => remapRemovedIndexesAfterRemove(prev, index));
  };

  const handleFormReset = () => {
    setGalleryFiles({});
    setRemovedImageIndexes(new Set());
  };

  const handleSubmit = async (values: FormValues): Promise<SubmitResult> => {
    const uploadedImagePublicIds: string[] = [];
    const oldImagePublicIds = new Set<string>();

    try {
      const nextUkGallery = [...(values.uk?.content?.gallery ?? [])];

      for (let index = 0; index < nextUkGallery.length; index += 1) {
        const newFile = galleryFiles[index];
        const isRemoved = removedImageIndexes.has(index);
        const currentItem = nextUkGallery[index];

        if (!currentItem) {
          continue;
        }

        const oldImagePublicId = currentItem.publicId ?? null;

        if (isRemoved && !newFile) {
          nextUkGallery[index] = {
            ...currentItem,
            secureUrl: undefined,
            publicId: undefined,
          };

          if (oldImagePublicId) {
            oldImagePublicIds.add(oldImagePublicId);
          }

          continue;
        }

        if (!newFile) {
          continue;
        }

        const uploadResult = await uploadImageAction({
          file: newFile,
          fileName: `about-gallery-${index + 1}`,
        });

        if (!uploadResult.success) {
          throw new Error(uploadResult.error);
        }

        const uploadedImage = uploadResult.data;

        nextUkGallery[index] = {
          ...currentItem,
          secureUrl: uploadedImage.secureUrl,
          publicId: uploadedImage.publicId,
        };

        uploadedImagePublicIds.push(uploadedImage.publicId);

        if (oldImagePublicId && oldImagePublicId !== uploadedImage.publicId) {
          oldImagePublicIds.add(oldImagePublicId);
        }
      }

      const nextEnGallery = (values.en?.content?.gallery ?? []).map((enItem, index) => {
        if (!enItem) {
          return enItem;
        }

        const ukGalleryItem = nextUkGallery[index];

        return {
          ...enItem,
          secureUrl: ukGalleryItem?.secureUrl ?? undefined,
          publicId: ukGalleryItem?.publicId ?? undefined,
        };
      });

      const res = await updateAboutMultiLangAction({
        ...values,
        uk: {
          ...values.uk,
          content: {
            ...values.uk.content,
            gallery: nextUkGallery,
          },
        },
        en: {
          ...values.en,
          content: {
            ...values.en.content,
            gallery: nextEnGallery,
          },
        },
      });

      if (!res.success) {
        await Promise.all(uploadedImagePublicIds.map((publicId) => deleteImageAction(publicId)));
        showMessage.error("Не вдалося оновити дані");

        return { success: false, error: "Не вдалося оновити дані" };
      }

      if (oldImagePublicIds.size) {
        const cleanupResults = await Promise.all(
          Array.from(oldImagePublicIds).map((publicId) => deleteImageAction(publicId)),
        );
        const hasCleanupErrors = cleanupResults.some((result) => !result.success);

        if (hasCleanupErrors) {
          showMessage.warn("Контент оновлено, але частину старих зображень не вдалося видалити зі сховища");
        }
      }

      return { success: true, nextUkGallery, nextEnGallery };
    } catch {
      await Promise.all(uploadedImagePublicIds.map((publicId) => deleteImageAction(publicId)));
      showMessage.error("Не вдалося оновити дані");

      return { success: false, error: "Internal Server Error" };
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
    startTransition(async () => {
      try {
        const result = await handleSubmit(pendingData);

        if (result && !result.success) {
          return;
        }

        if (result.success) {
          formMethodsRef.current?.setValue("uk.content.gallery", result.nextUkGallery, {
            shouldDirty: false,
            shouldValidate: false,
          });
          formMethodsRef.current?.setValue("en.content.gallery", result.nextEnGallery, {
            shouldDirty: false,
            shouldValidate: false,
          });
          showMessage.success("Дані успішно оновилися!");
        }

        router.refresh();
        setIsModalOpen(false);
        setGalleryFiles({});
        setRemovedImageIndexes(new Set());
      } catch {
        showMessage.error("Помилка при збереженні");
      }
    });
  };

  return (
    <>
      <FormWrapper<FormValues>
        schema={adminSchema}
        initialValues={data}
        onSubmit={onFormSubmit}
        key={JSON.stringify(data.uk.content.gallery.map((i) => i?.secureUrl))}
      >
        {(methods) => {
          formMethodsRef.current = methods;

          return (
            <AboutFormContent
              data={data}
              onReset={handleFormReset}
              galleryFiles={galleryFiles}
              removedImageIndexes={removedImageIndexes}
              onGalleryFileChange={handleGalleryFileChange}
              onGalleryItemRemove={handleGalleryItemRemove}
              onGalleryImageRemove={handleGalleryImageRemove}
            />
          );
        }}
      </FormWrapper>

      <ConfirmModal
        isOpen={isModalOpen}
        isLoading={isPending}
        title="Підтвердіть зміни"
        handleConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
        content="Ви впевнені, що хочете зберегти зміни в секції Про корпус?"
      />
    </>
  );
};
