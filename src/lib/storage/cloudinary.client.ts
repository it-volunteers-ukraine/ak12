import "server-only";

import crypto from "node:crypto";
import { ImageStorage, StoredImage } from "./types";
import { serverEnv } from "@/lib/env/server";
import { sanitizeFileName } from "./file-name";
import { validateImageFile } from "./file-validation";
import { logger } from "@/lib/logger/logger";

function getUploadEnv() {
  const cloudName = serverEnv.cloudinary.cloudName;
  const apiKey = serverEnv.cloudinary.apiKey;
  const apiSecret = serverEnv.cloudinary.apiSecret;
  const folder = serverEnv.cloudinary.mediaFolder;

  if (!cloudName || !apiKey || !apiSecret || !folder) {
    throw new Error("Не вдалося знайти змінні середовища для сервісу завантаження зображень");
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    folder,
  };
}

type UploadResult = {
  public_id: string;
  secure_url: string;
};

type SignatureParams = Record<string, string | number | boolean>;

function createSignature(params: SignatureParams) {
  const { apiSecret } = getUploadEnv();
  const serializedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${String(params[key])}`)
    .join("&");

  return crypto
    .createHash("sha256")
    .update(serializedParams + apiSecret, "utf8")
    .digest("hex");
}

async function uploadImage(params: { file: File; fileName: string }): Promise<StoredImage> {
  const { cloudName, apiKey, folder } = getUploadEnv();
  const { file, fileName } = params;

  await validateImageFile(file);

  const safeFileName = sanitizeFileName(fileName);
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    folder,
    public_id: safeFileName,
    overwrite: true,
    invalidate: true,
    timestamp,
  };

  const signature = createSignature(paramsToSign);
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("folder", folder);
  formData.append("public_id", safeFileName);
  formData.append("overwrite", "true");
  formData.append("invalidate", "true");
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  const data: UploadResult & { error?: { message?: string } } = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Не вдалося завантажити зображення");
  }

  logger.info("Image upload completed");

  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
  };
}

async function deleteImage(publicId: string): Promise<void> {
  const { cloudName, apiKey } = getUploadEnv();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createSignature({
    public_id: publicId,
    invalidate: "true",
    timestamp,
  });

  const formData = new FormData();

  formData.append("public_id", publicId);
  formData.append("invalidate", "true");
  formData.append("timestamp", String(timestamp));
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Не вдалося видалити зображення");
  }

  logger.info("Image deletion completed");
}

function getImageUrl(fileName: string): string | undefined {
  const cloudName = serverEnv.cloudinary.cloudName;
  const folder = serverEnv.cloudinary.mediaFolder;

  if (!cloudName || !folder || !fileName) {
    return undefined;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${folder}/${fileName}`;
}

export const cloudinaryStorage: ImageStorage = {
  uploadImage,
  deleteImage,
  getImageUrl,
};
