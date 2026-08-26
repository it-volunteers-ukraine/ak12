import { ImageStorage } from "./types";
import { cloudinaryStorage } from "./cloudinary.client";
import { minioStorage } from "./minio.client";
import { serverEnv } from "@/lib/env/server";

let storage: ImageStorage | null = null;

export function getStorage(): ImageStorage {
  if (!storage) {
    const client = serverEnv.storage.client;

    storage = client === "minio" ? minioStorage : cloudinaryStorage;
  }

  return storage;
}
