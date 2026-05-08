export const EMPTY_GALLERY_ITEM = {
  text: "",
  secureUrl: "",
  publicId: undefined,
};

export const remapFilesAfterRemove = (files: Record<number, File | null>, removedIndex: number) => {
  const next: Record<number, File | null> = {};

  for (const [indexStr, file] of Object.entries(files)) {
    const index = Number(indexStr);

    if (index < removedIndex) {
      next[index] = file;
      continue;
    }

    if (index > removedIndex) {
      next[index - 1] = file;
    }
  }

  return next;
};

export const remapRemovedIndexesAfterRemove = (indexes: Set<number>, removedIndex: number) => {
  const next = new Set<number>();

  for (const index of indexes) {
    if (index < removedIndex) {
      next.add(index);
      continue;
    }

    if (index > removedIndex) {
      next.add(index - 1);
    }
  }

  return next;
};
