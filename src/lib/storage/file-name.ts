export function sanitizeFileName(fileName: string) {
  const normalized = fileName.trim();

  if (!normalized) {
    throw new Error("Назва файлу є обов'язковою");
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
