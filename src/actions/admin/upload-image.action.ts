"use server";

import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/constants";
import { verifySession } from "@/lib/auth/session.service";
import { uploadImage, deleteImage, type StoredImage } from "@/lib/admin/upload-image.service";
import { logger } from "@/lib/logger/logger";

type UploadImageResult = { success: true; data: StoredImage } | { success: false; error: string };
type DeleteImageResult = { success: true } | { success: false; error: string };

async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const isValid = verifySession(token);

  if (!isValid) {
    logger.warn("Image upload rejected: missing or invalid admin session");
    throw new Error("Сесію адміністратора не знайдено або її термін дії минув");
  }
}

export async function uploadImageAction(params: { file: File; fileName: string }): Promise<UploadImageResult> {
  try {
    await requireAdminSession();

    const uploaded = await uploadImage({
      file: params.file,
      fileName: params.fileName,
    });

    return {
      success: true,
      data: uploaded,
    };
  } catch (error) {
    logger.error({ error }, "Image upload action failed");

    return {
      success: false,
      error: error instanceof Error ? error.message : "Не вдалося завантажити зображення",
    };
  }
}

export async function deleteImageAction(publicId: string): Promise<DeleteImageResult> {
  try {
    await requireAdminSession();
    await deleteImage(publicId);

    return {
      success: true,
    };
  } catch (error) {
    logger.error({ error }, "Image deletion action failed");

    return {
      success: false,
      error: error instanceof Error ? error.message : "Не вдалося видалити зображення",
    };
  }
}
