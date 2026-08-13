import "server-only";

import crypto from "node:crypto";
import { Client } from "minio";
import { ImageStorage } from "./types";
import { serverEnv } from "@/lib/env/server";
import { sanitizeFileName } from "./file-name";
import { validateImageFile } from "./file-validation";

let client: Client | null = null;

export function getMinioClient(): Client {
  if (!client) {
    const endpoint = serverEnv.storage.endpoint;
    const accessKey = serverEnv.storage.accessKey;
    const secretKey = serverEnv.storage.secretKey;

    if (!endpoint || !accessKey || !secretKey) {
      throw new Error("Не налаштовано сховище. Необхідні STORAGE_ENDPOINT, STORAGE_ACCESS_KEY та STORAGE_SECRET_KEY.");
    }

    const url = new URL(endpoint);

    client = new Client({
      endPoint: url.hostname,
      port: Number(url.port) || (url.protocol === "https:" ? 443 : 80),
      useSSL: url.protocol === "https:",
      accessKey,
      secretKey,
    });
  }

  return client;
}

function getStorageBucket(): string {
  const bucket = serverEnv.storage.bucket;

  if (!bucket) {
    throw new Error("Не налаштовано STORAGE_BUCKET.");
  }

  return bucket;
}

const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function uploadImage({ file, fileName }: { file: File; fileName: string }) {
  const client = getMinioClient();
  const bucket = getStorageBucket();

  await validateImageFile(file);

  const body = Buffer.from(await file.arrayBuffer());
  const safeFileName = sanitizeFileName(fileName);
  const folder = serverEnv.storage.mediaFolder;
  const extension = EXTENSION_BY_MIME_TYPE[file.type];

  if (!extension) {
    throw new Error("Непідтримуваний формат зображення.");
  }

  const uniqueId = crypto.randomUUID();
  const objectKey = folder
    ? `${folder}/${safeFileName}-${uniqueId}.${extension}`
    : `${safeFileName}-${uniqueId}.${extension}`;

  await client.putObject(bucket, objectKey, body, body.length, {
    "Content-Type": file.type,
  });

  return {
    publicId: objectKey,
    secureUrl: `/api/media/${objectKey}`,
  };
}

async function deleteImage(publicId: string): Promise<void> {
  const client = getMinioClient();
  const bucket = getStorageBucket();

  await client.removeObject(bucket, publicId);
}

function getImageUrl(fileName: string): string | undefined {
  const endpoint = serverEnv.storage.endpoint;
  const folder = serverEnv.storage.mediaFolder;

  if (!endpoint || !fileName) {
    return undefined;
  }

  const objectKey = folder ? `${folder}/${fileName}` : fileName;

  return `/api/media/${objectKey}`;
}

export const minioStorage: ImageStorage = {
  uploadImage,
  deleteImage,
  getImageUrl,
};
