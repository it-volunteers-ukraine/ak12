"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showMessage } from "@/components/toastify";
import { deleteSubdivision } from "@/actions/subdivisions";
import { deleteImageAction } from "@/actions/admin/upload-image.actions";
import { Subdivision } from "@/types";
import { Button } from "@/components/button";
import { ConfirmModal } from "@/components";
import { EditIcon, TrashIcon } from "../../../../../public/icons";
import { SubdivisionSection } from "../index";

interface ISubdivisionsListSection {
  subdivisionsUk: Subdivision[];
  subdivisionsEn: Subdivision[];
}

export const SubdivisionsListSection = ({
  subdivisionsUk,
  subdivisionsEn,
}: ISubdivisionsListSection) => {
  const router = useRouter();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [deletingSubdivision, setDeletingSubdivision] = useState<Subdivision | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const editingUk = subdivisionsUk.find((s) => s.slug === editingSlug) ?? null;
  const editingEn = subdivisionsEn.find((s) => s.slug === editingSlug) ?? null;

  const handleDeleteConfirm = async () => {
    if (!deletingSubdivision) return;

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

      showMessage.success("Підрозділ видалено");
      setDeletingSubdivision(null);
      router.refresh();
    } catch {
      showMessage.error("Не вдалося видалити підрозділ");
    } finally {
      setIsDeleting(false);
    }
  };

  if (editingSlug && editingUk) {
    return (
      <SubdivisionSection
        data={{
          uk: editingUk,
          en: editingEn ?? editingUk,
        }}
        onSuccess={() => setEditingSlug(null)}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Всі підрозділи</h1>
        <button
          onClick={() => router.push("new")}
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
        >
          + Додати підрозділ
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="grid grid-cols-[1fr_160px_80px] border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-500">
          <span>Назва підрозділу</span>
          <span>Дата оновлення</span>
          <span>Дії</span>
        </div>

        {subdivisionsUk.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400">
            Підрозділи відсутні. Додайте перший підрозділ.
          </div>
        ) : (
          subdivisionsUk.map((subdivision) => (
            <div
              key={subdivision.id}
              className="grid grid-cols-[1fr_160px_80px] items-center border-b border-gray-100 px-4 py-4 last:border-0 hover:bg-gray-50"
            >
              <span className="text-sm font-medium">
                {subdivision.hoverName ?? subdivision.name}
              </span>
              <span className="text-sm text-gray-400">
                {new Date(subdivision.updatedAt).toLocaleDateString("uk-UA")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingSlug(subdivision.slug)}
                  className="rounded-full p-1.5 hover:bg-gray-100"
                  aria-label="Редагувати"
                >
                  <EditIcon className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setDeletingSubdivision(subdivision)}
                  className="rounded-full p-1.5 hover:bg-red-50"
                  aria-label="Видалити"
                >
                  <TrashIcon className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deletingSubdivision)}
        onClose={() => setDeletingSubdivision(null)}
      >
        <ConfirmModal.ModalTitle>Видалити підрозділ</ConfirmModal.ModalTitle>
        <ConfirmModal.ModalContent>
          Ви впевнені, що хочете видалити &quot;{deletingSubdivision?.hoverName ?? deletingSubdivision?.name}&quot;? Цю дію не можна скасувати.
        </ConfirmModal.ModalContent>
        <ConfirmModal.ModalFooter>
          <Button
            variant="danger"
            isLoading={isDeleting}
            onClick={handleDeleteConfirm}
            className="w-full rounded-full"
          >
            Видалити
          </Button>
          <Button
            variant="outline"
            onClick={() => setDeletingSubdivision(null)}
            isLoading={isDeleting}
            className="w-full rounded-full"
          >
            Скасувати
          </Button>
        </ConfirmModal.ModalFooter>
      </ConfirmModal>
    </div>
  );
};