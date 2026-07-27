import crypto from "node:crypto";

import { serverEnv } from "@/lib/env/server";

// TODO(minio): this service is Cloudinary-specific (signed upload/destroy against
// api.cloudinary.com). Production uses MinIO, so introduce a storage abstraction
// mirroring the DatabaseClient pattern in src/lib/db: an ImageStorage interface with
// uploadImage/deleteImage, a Cloudinary implementation (this file) for dev, a MinIO
// (S3-compatible, e.g. @aws-sdk/client-s3) implementation for prod, and a selector
// that picks by NODE_ENV. Keep all MinIO secrets server-side only.
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

export type StoredImage = {
  publicId: string;
  secureUrl: string;
};

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

function sanitizeFileName(fileName: string) {
  const normalized = fileName.trim();

  if (!normalized) {
    throw new Error("Назва файлу є обов’язковою");
  }

  const safeName = normalized
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!safeName) {
    throw new Error("Не вдалося сформувати коректну назву файлу");
  }

  return safeName;
}

export async function validateImageFile(file: File) {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Допустимі формати: JPG, JPEG, PNG, WEBP");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Максимальна вага файлу — 5 MB");
  }
}

export async function uploadImage(params: { file: File; fileName: string }): Promise<StoredImage> {
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

  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
  };
}

export async function deleteImage(publicId: string) {
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

  return data;
}
