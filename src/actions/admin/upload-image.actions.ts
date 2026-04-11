"use server";

import { uploadImage, deleteImage, type StoredImage } from "@/lib/admin/upload-image.service";

type UploadImageResult = { success: true; data: StoredImage } | { success: false; error: string };
type DeleteImageResult = { success: true } | { success: false; error: string };

export async function uploadImageAction(params: { file: File; fileName: string }): Promise<UploadImageResult> {
  try {
    const uploaded = await uploadImage({
      file: params.file,
      fileName: params.fileName,
    });

    return {
      success: true,
      data: uploaded,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Не вдалося завантажити зображення",
    };
  }
}

export async function deleteImageAction(publicId: string): Promise<DeleteImageResult> {
  try {
    await deleteImage(publicId);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Не вдалося видалити зображення",
    };
  }
}
