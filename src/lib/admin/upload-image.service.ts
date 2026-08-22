import { getStorage } from "@/lib/storage";

export async function uploadImage(params: { file: File; fileName: string }) {
  return getStorage().uploadImage(params);
}

export async function deleteImage(publicId: string) {
  return getStorage().deleteImage(publicId);
}
