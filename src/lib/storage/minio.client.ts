import "server-only";

import crypto from "node:crypto";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ImageStorage } from "./types";
import { serverEnv } from "@/lib/env/server";
import { sanitizeFileName } from "./file-name";
import { validateImageFile } from "./file-validation";
import { getS3Client } from "./s3-client";

const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const minioStorage: ImageStorage = {
  async uploadImage({ file, fileName }) {
    const client = getS3Client();
    const bucket = serverEnv.storage.bucket;

    if (!bucket) {
      throw new Error("Missing STORAGE_BUCKET");
    }

    await validateImageFile(file);

    const body = Buffer.from(await file.arrayBuffer());
    const safeFileName = sanitizeFileName(fileName);
    const folder = serverEnv.storage.mediaFolder;
    const extension = EXTENSION_BY_MIME_TYPE[file.type];

    if (!extension) {
      throw new Error("Unsupported image format");
    }

    const uniqueId = crypto.randomUUID();

    const objectKey = folder
      ? `${folder}/${safeFileName}-${uniqueId}.${extension}`
      : `${safeFileName}-${uniqueId}.${extension}`;

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: body,
        ContentType: file.type,
      }),
    );

    return {
      publicId: objectKey,
      secureUrl: `/api/media/${objectKey}`,
    };
  },

  async deleteImage(publicId) {
    const client = getS3Client();
    const bucket = serverEnv.storage.bucket;

    if (!bucket) {
      throw new Error("Missing STORAGE_BUCKET");
    }

    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: publicId,
      }),
    );
  },
};
