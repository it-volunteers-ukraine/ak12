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
