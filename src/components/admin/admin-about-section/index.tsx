"use client";

import { useState } from "react";

import z from "zod";
import { useRouter } from "next/navigation";

import { FormBuilder } from "@/lib/form-builder";
import { showMessage } from "@/components/toastify";
import { FormImg } from "@/components/form-elements";
import { AdminDataMap } from "@/lib/admin/admin-types";
import { ADMIN_SCHEMAS } from "@/lib/admin/admin-schemas";
import { ConfirmModal } from "@/components/connfirm-modal";
import { updateAboutMultiLangAction } from "@/actions/about";
import { createAboutFormBuilderConfig } from "@/lib/admin/configs/about.config";
import { deleteImageAction, uploadImageAction } from "@/actions/admin/upload-image.actions";

import { FormWrapper } from "../form";

type FormValues = z.infer<typeof adminSchema>;
type AdminData = AdminDataMap["about"];
interface IAboutSection {
  data: AdminData;
}

export const adminSchema = ADMIN_SCHEMAS.about;

export const AboutSectionAdmin = ({ data }: IAboutSection) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState<FormValues | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<Record<number, File | null>>({});
  const [removedImageIndexes, setRemovedImageIndexes] = useState<Set<number>>(new Set());

  const existingGallery = data.uk?.content?.gallery ?? [];

  const handleGalleryFileChange = (index: number, file: File | null) => {
    setGalleryFiles((prev) => ({ ...prev, [index]: file }));
    setRemovedImageIndexes((prev) => {
      const next = new Set(prev);

      next.delete(index);

      return next;
    });
  };

  const handleGalleryRemove = (index: number) => {
    setGalleryFiles((prev) => ({ ...prev, [index]: null }));
    setRemovedImageIndexes((prev) => new Set(prev).add(index));
  };

  const handleFormReset = () => {
    setGalleryFiles({});
    setRemovedImageIndexes(new Set());
  };

  const handleSubmit = async (values: FormValues) => {
    const uploadedImagePublicIds: string[] = [];
    const oldImagePublicIdsForCleanup = new Set<string>();

    try {
      const nextUkGallery = [...(values.uk?.content?.gallery ?? [])];
      const nextEnGallery = [...(values.en?.content?.gallery ?? [])];

      for (let index = 0; index < nextUkGallery.length; index += 1) {
        const newFile = galleryFiles[index];
        const isRemoved = removedImageIndexes.has(index);
        const ukItem = nextUkGallery[index];
        const enItem = nextEnGallery[index];
        const oldImagePublicId =
          data.uk?.content?.gallery?.[index]?.publicId ?? data.en?.content?.gallery?.[index]?.publicId ?? null;

        if (isRemoved && !newFile) {
          if (ukItem) {
            ukItem.secureUrl = "";
            ukItem.publicId = undefined;
          }

          if (enItem) {
            enItem.secureUrl = "";
            enItem.publicId = undefined;
          }

          if (oldImagePublicId) {
            oldImagePublicIdsForCleanup.add(oldImagePublicId);
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

        uploadedImagePublicIds.push(uploadedImage.publicId);

        if (ukItem) {
          ukItem.secureUrl = uploadedImage.secureUrl;
          ukItem.publicId = uploadedImage.publicId;
        }

        if (enItem) {
          enItem.secureUrl = uploadedImage.secureUrl;
          enItem.publicId = uploadedImage.publicId;
        }

        if (oldImagePublicId && oldImagePublicId !== uploadedImage.publicId) {
          oldImagePublicIdsForCleanup.add(oldImagePublicId);
        }
      }

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

        return res;
      }

      if (oldImagePublicIdsForCleanup.size) {
        const cleanupResults = await Promise.all(
          Array.from(oldImagePublicIdsForCleanup).map((publicId) => deleteImageAction(publicId)),
        );
        const hasCleanupErrors = cleanupResults.some((result) => !result.success);

        if (hasCleanupErrors) {
          showMessage.warn("Контент оновлено, але частину старих зображень не вдалося видалити зі сховища");
        }
      }

      showMessage.success("Дані успішно оновилися!");
      setGalleryFiles({});
      setRemovedImageIndexes(new Set());
      router.refresh();

      return res;
    } catch {
      await Promise.all(uploadedImagePublicIds.map((publicId) => deleteImageAction(publicId)));
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

  return (
    <>
      <FormWrapper<FormValues>
        schema={adminSchema}
        initialValues={data}
        onSubmit={onFormSubmit}
        key={data.uk?.mainTitle || data.en?.mainTitle || "about"}
      >
        <FormBuilder data={data} config={createAboutFormBuilderConfig(data)} onReset={handleFormReset} />

        {!!existingGallery.length && (
          <div className="mt-10 space-y-6">
            <h4 className="text-lg font-medium">Зображення галереї</h4>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {existingGallery.map((item, index) => {
                const currentImageSrc =
                  removedImageIndexes.has(index) && !galleryFiles[index] ? null : (item?.secureUrl ?? null);

                return (
                  <div key={`about-gallery-image-${index}`}>
                    <FormImg
                      src={currentImageSrc}
                      file={galleryFiles[index] ?? null}
                      onRemove={() => handleGalleryRemove(index)}
                      onFileChange={(file) => handleGalleryFileChange(index, file)}
                      label={`Фото елемента #${index + 1}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </FormWrapper>

      <ConfirmModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        title="Підтвердіть зміни"
        handleConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
        content="Ви впевнені, що хочете зберегти зміни в секції Про корпус?"
      />
    </>
  );
};
