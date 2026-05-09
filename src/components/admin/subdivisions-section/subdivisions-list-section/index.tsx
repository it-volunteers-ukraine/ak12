"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Subdivision } from "@/types";
import { ConfirmModal } from "@/components";
import { showMessage } from "@/components/toastify";
import { deleteSubdivision, updateSubdivisionsOrder } from "@/actions/subdivisions";
import { deleteImageAction } from "@/actions/admin/upload-image.actions";
import { DndSortableList } from "@/components/admin/dnd-sortable-list";

import { SubdivisionSection } from "../index";
import { EditIcon, TrashIcon } from "../../../../../public/icons";

interface ISubdivisionsListSection {
  subdivisionsEn: Subdivision[];
  subdivisionsUk: Subdivision[];
}

export const SubdivisionsListSection = ({ subdivisionsUk, subdivisionsEn }: ISubdivisionsListSection) => {
  const router = useRouter();
  const [items, setItems] = useState<Subdivision[]>(subdivisionsUk);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [deletingSubdivision, setDeletingSubdivision] = useState<Subdivision | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const editingUk = items.find((s) => s.slug === editingSlug) ?? null;
  const editingEn = subdivisionsEn.find((s) => s.slug === editingSlug) ?? null;

  const handleReorder = async (reordered: Subdivision[]) => {
    const previousOrder = [...items];

    setItems(reordered);

    const updates = reordered.flatMap((item, index) => {
      const enVersion = subdivisionsEn.find((s) => s.slug === item.slug);
      const sortOrder = (index + 1) * 10;

      return [{ id: item.id, sortOrder }, ...(enVersion ? [{ id: enVersion.id, sortOrder }] : [])];
    });

    try {
      await updateSubdivisionsOrder(updates);
      showMessage.success("Порядок збережено");
      router.refresh();
    } catch {
      showMessage.error("Не вдалося зберегти порядок");
      setItems(previousOrder);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSubdivision) {
      return;
    }

    const previousItems = [...items]; // зберегти для rollback

    setIsDeleting(true);

    try {
      const enVersion = subdivisionsEn.find((s) => s.slug === deletingSubdivision.slug);

      if (deletingSubdivision.imageUrl?.publicId) {
        await deleteImageAction(deletingSubdivision.imageUrl.publicId);
      }

      if (deletingSubdivision.hoverImageUrl?.publicId) {
        await deleteImageAction(deletingSubdivision.hoverImageUrl.publicId);
      }

      await deleteSubdivision(deletingSubdivision.id);

      if (enVersion?.id) {
        await deleteSubdivision(enVersion.id);
      }

      setItems((prev) => prev.filter((s) => s.slug !== deletingSubdivision.slug));
      showMessage.success("Підрозділ видалено");
      router.refresh();
    } catch {
      setItems(previousItems);
      showMessage.error("Не вдалося видалити підрозділ");
    } finally {
      setIsDeleting(false);
      setDeletingSubdivision(null);
    }
  };
  if (editingSlug && editingUk) {
    return (
      <SubdivisionSection
        data={{ uk: editingUk, en: editingEn ?? editingUk }}
        onSuccess={() => setEditingSlug(null)}
        onBack={() => setEditingSlug(null)}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("new")}
          className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-700"
        >
          + Додати підрозділ
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="grid grid-cols-[40px_1fr_160px_80px] border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-500">
          <span />
          <span>Назва підрозділу</span>
          <span>Дата оновлення</span>
          <span>Дії</span>
        </div>

        {items.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400">Підрозділи відсутні. Додайте перший підрозділ.</div>
        ) : (
          <DndSortableList
            items={items}
            onReorder={handleReorder}
            renderItem={(subdivision) => (
              <div className="grid grid-cols-[40px_1fr_160px_80px] items-center border-b border-gray-100 py-4 pr-4 last:border-0 hover:bg-gray-50">
                <span />
                <span className="text-sm font-medium">{subdivision.hoverName ?? subdivision.name}</span>
                <span className="text-sm text-gray-400">
                  {subdivision.updatedAt ? new Date(subdivision.updatedAt).toLocaleDateString("uk-UA") : "—"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSlug(subdivision.slug);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="rounded-full p-1.5 hover:bg-gray-100"
                    aria-label="Редагувати"
                  >
                    <EditIcon className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingSubdivision(subdivision);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="rounded-full p-1.5 hover:bg-red-50"
                    aria-label="Видалити"
                  >
                    <TrashIcon className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            )}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deletingSubdivision)}
        onClose={() => setDeletingSubdivision(null)}
        handleConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Видалити підрозділ"
        content={`Ви впевнені, що хочете видалити "${deletingSubdivision?.hoverName ?? deletingSubdivision?.name}"? Цю дію не можна скасувати.`}
        confirmButtonText="Видалити"
        cancelButtonText="Скасувати"
      />
    </div>
  );
};
