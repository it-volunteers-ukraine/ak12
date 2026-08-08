export interface StoredImage {
  publicId: string;
  secureUrl: string;
}

export interface ImageStorage {
  uploadImage(params: { file: File; fileName: string }): Promise<StoredImage>;

  deleteImage(publicId: string): Promise<void>;
}
