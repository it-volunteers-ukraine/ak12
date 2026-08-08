import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { serverEnv } from "@/lib/env/server";

let client: S3Client | null = null;

export function getS3Client() {
  if (!client) {
    const endpoint = serverEnv.storage.endpoint;
    const accessKeyId = serverEnv.storage.accessKey;
    const secretAccessKey = serverEnv.storage.secretKey;

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      throw new Error(
        "Missing storage configuration. STORAGE_ENDPOINT, STORAGE_ACCESS_KEY and STORAGE_SECRET_KEY are required.",
      );
    }

    const region = serverEnv.storage.region ?? "auto";

    client = new S3Client({
      endpoint,
      region,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return client;
}
