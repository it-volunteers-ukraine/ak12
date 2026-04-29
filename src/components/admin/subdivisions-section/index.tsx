"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";

import { showMessage } from "@/components/toastify";
import { FormImg } from "@/components/form-elements";
import { BtnGroup } from "@/components/admin/admin-form-elements";
import { LocaleSection } from "@/lib/form-builder/components/LocaleSection";
import { StoredImage } from "@/lib/admin/upload-image.service";
import { ConfirmModal } from "@/components/connfirm-modal";
import { uploadImageAction, deleteImageAction } from "@/actions/admin/upload-image.actions";
import { createSubdivision, updateSubdivision } from "@/actions/subdivisions";
import { subdivisionFormBuilderConfig } from "@/lib/admin/configs/subdivision.config";

import { FormWrapper } from "../form";
import { adminSchema, AdminData, ISubdivisionSection } from "./config";

// Внутрішній компонент форми — має доступ до formContext

const SubdivisionFormContent = ({
  data,
  imageFile,
  hoverImageFile,
  removeImage,
  removeHoverImage,
  existingImage,
  existingHoverImage,
  onImageChange,
  onImageRemove,
  onHoverImageChange,
  onHoverImageRemove,
  onReset,
}: {
  data?: AdminData;
  imageFile: File | null;
  hoverImageFile: File | null;
  removeImage: boolean;
  removeHoverImage: boolean;
  existingImage: StoredImage | null;
  existingHoverImage: StoredImage | null;
  onImageChange: (f: File | null) => void;
  onImageRemove: () => void;
  onHoverImageChange: (f: File | null) => void;
  onHoverImageRemove: () => void;
  onReset: () => void;
}) => {
  const {
    reset,
    formState: { isValid },
  } = useFormContext();

  const bannerSrc = removeImage ? null : existingImage;
  const hoverSrc = removeHoverImage ? null : existingHoverImage;

  return (
    <>
      {/* Кнопки керування */}
      <BtnGroup
        isValid={isValid}
        onReset={() => {
          reset(data);
          onReset();
        }}
        submitText="Зберегти зміни"
        resetText="Скасувати правки"
      />

      {/* Ряд з двома фото */}
      <div className="mb-10 flex flex-wrap gap-6">
        <div className="min-w-[300px] flex-1">
          <FormImg
            label="Фото на сайті (герб)"
            src={bannerSrc?.secureUrl ?? null}
            file={imageFile}
            onFileChange={onImageChange}
            onRemove={onImageRemove}
          />
        </div>
        <div className="min-w-[300px] flex-1">
          <FormImg
            label="Hover фото"
            src={hoverSrc?.secureUrl ?? null}
            file={hoverImageFile}
            onFileChange={onHoverImageChange}
            onRemove={onHoverImageRemove}
          />
        </div>
      </div>

      {/* Використовуємо FormBuilder для текстових полів */}
      {/* Він автоматично підхопить localeLayout: "split" з твого конфігу */}
      <div className="admin-form-content">
        {subdivisionFormBuilderConfig.sections.map((section) => (
          <div key={section.id} className="mb-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <LocaleSection section={section} showOutsideTitle={false} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export const SubdivisionSection = ({ data, onSuccess }: ISubdivisionSection) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState<AdminData | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [hoverImageFile, setHoverImageFile] = useState<File | null>(null);
  const [removeHoverImage, setRemoveHoverImage] = useState(false);

  const existingImage = data?.uk?.imageUrl || data?.en?.imageUrl || null;
  const existingHoverImage = data?.uk?.hoverImageUrl || data?.en?.hoverImageUrl || null;

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
      const generateSlug = (name: string) =>
        name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

      const buildPayload = (lang: "uk" | "en") => ({
        name: values[lang].name,
        slug: data?.uk?.slug || generateSlug(values.uk.name),
        description: values[lang].description,
        hoverName: values[lang].hoverName,
        hoverDescription: values[lang].hoverDescription,
        siteUrl: values[lang].siteUrl,
        isActive: values.uk.isActive ?? true,
        sortOrder: values.uk.sortOrder,
        languageCode: lang as "uk" | "en",
        languageId: lang === "uk" ? (data?.uk?.languageId ?? "") : (data?.en?.languageId ?? ""),
        imageUrl: nextImage,
        hoverImageUrl: nextHoverImage,
      });

      if (data?.uk?.id) {
        await updateSubdivision(data.uk.id, buildPayload("uk"));
        if (data?.en?.id) {
          await updateSubdivision(data.en.id, buildPayload("en"));
        }
      } else {
        await createSubdivision(buildPayload("uk"));
        await createSubdivision(buildPayload("en"));
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

  const onFormSubmit = (values: AdminData) => {
    setPendingData(values);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    if (!pendingData) {
      return;
    }
    setIsLoading(true);
    handleSubmit(pendingData).finally(() => {
      setIsLoading(false);
      setPendingData(null);
    });
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
    <>
      <FormWrapper<AdminData>
        schema={adminSchema}
        initialValues={formData}
        onSubmit={onFormSubmit}
        key={data?.uk?.id || "subdivision-new"}
      >
        <SubdivisionFormContent
          data={data}
          imageFile={imageFile}
          hoverImageFile={hoverImageFile}
          removeImage={removeImage}
          removeHoverImage={removeHoverImage}
          existingImage={existingImage}
          existingHoverImage={existingHoverImage}
          onImageChange={(f) => {
            setImageFile(f);
            setRemoveImage(false);
          }}
          onImageRemove={() => {
            setImageFile(null);
            setRemoveImage(true);
          }}
          onHoverImageChange={(f) => {
            setHoverImageFile(f);
            setRemoveHoverImage(false);
          }}
          onHoverImageRemove={() => {
            setHoverImageFile(null);
            setRemoveHoverImage(true);
          }}
          onReset={() => {
            setImageFile(null);
            setHoverImageFile(null);
            setRemoveImage(false);
            setRemoveHoverImage(false);
          }}
        />
      </FormWrapper>

      <ConfirmModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        onClose={() => setIsModalOpen(false)}
        handleConfirm={handleConfirm}
        title="Підтвердіть зміни"
        content="Ви впевнені, що хочете зберегти зміни?"
      />
    </>
  );
};
