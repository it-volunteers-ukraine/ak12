"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { ConfirmModal } from "@/components";
import { VacancyMapped } from "@/types/vacancy";
import { showMessage } from "@/components/toastify";
import { DndSortableList } from "@/components/admin/dnd-sortable-list";
import { deleteVacancy } from "@/actions/vacancies/delete-vacancy.action";
import { reorderVacancies } from "@/actions/vacancies/reorder-vacancies.action";
import { updateVacancyStatus } from "@/actions/vacancies/update-vacancy-status.action";

import { VacancySection } from "..";
import { EditIcon, TrashIcon } from "../../../../../public/icons";

interface Props {
  vacanciesEn: VacancyMapped[];
  vacanciesUk: VacancyMapped[];
}
type VacancyItem = VacancyMapped & { id: string };

export const VacanciesListSection = ({ vacanciesUk, vacanciesEn }: Props) => {
  const router = useRouter();

  const [items, setItems] = useState<VacancyItem[]>(vacanciesUk as VacancyItem[]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingVacancy, setDeletingVacancy] = useState<VacancyItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Шукаємо EN пару по sort_order
  const getEnVersion = (ukItem: VacancyItem): VacancyMapped | undefined =>
    vacanciesEn.find((v) => v.sortOrder === ukItem.sortOrder);

  const editingUk = items.find((v) => v.id === editingId) ?? null;
  const editingEn = editingUk ? (getEnVersion(editingUk) ?? null) : null;

  // ─── Reorder ───────────────────────────────────────────────────────────────

  const handleReorder = async (reordered: VacancyItem[]) => {
    const previousOrder = [...items];
    setItems(reordered);

    try {
      await reorderVacancies({
        items: reordered.map((item, index) => ({
          ukId: item.id,
          enId: getEnVersion(item)?.id ?? item.id,
          sortOrder: (index + 1) * 10,
        })),
      });
      showMessage.success("Порядок збережено");
      router.refresh();
    } catch {
      showMessage.error("Не вдалося зберегти порядок");
      setItems(previousOrder);
    }
  };

  // ─── Toggle isActive ───────────────────────────────────────────────────────

  const handleToggleActive = async (vacancy: VacancyItem) => {
    const newStatus = !vacancy.isActive;
    const previousItems = [...items];
    const enVersion = getEnVersion(vacancy);

    if (!enVersion) {
      showMessage.error("Не знайдено EN версію вакансії");
      return;
    }

    setItems((prev) => prev.map((v) => (v.id === vacancy.id ? { ...v, isActive: newStatus } : v)));

    try {
      await updateVacancyStatus({
        ukId: vacancy.id,
        enId: enVersion.id,
        isActive: newStatus,
      });
      router.refresh();
    } catch {
      showMessage.error("Не вдалося змінити статус");
      setItems(previousItems);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────────────

  const handleDeleteConfirm = async () => {
    if (!deletingVacancy) return;

    const enVersion = getEnVersion(deletingVacancy);
    if (!enVersion) {
      showMessage.error("Не знайдено EN версію вакансії");
      setDeletingVacancy(null);
      return;
    }

    const previousItems = [...items];
    setIsDeleting(true);

    try {
      await deleteVacancy({ ukId: deletingVacancy.id, enId: enVersion.id });
      setItems((prev) => prev.filter((v) => v.id !== deletingVacancy.id));
      showMessage.success("Вакансію видалено");
      router.refresh();
    } catch {
      setItems(previousItems);
      showMessage.error("Не вдалося видалити вакансію");
    } finally {
      setIsDeleting(false);
      setDeletingVacancy(null);
    }
  };

  // ─── Edit mode ─────────────────────────────────────────────────────────────

  if (editingId && editingUk) {
    return (
      <VacancySection
        data={{ uk: editingUk, en: editingEn ?? editingUk }}
        onSuccess={() => setEditingId(null)}
        onBack={() => setEditingId(null)}
      />
    );
  }

  // ─── List ──────────────────────────────────────────────────────────────────

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.push("new")}
          className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-700"
        >
          + Додати вакансію
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        {/* Header */}
        <div className="grid grid-cols-[40px_1fr_120px_160px_80px] border-b border-gray-200 px-6 py-3 text-sm font-medium text-gray-500">
          <span>#</span>
          <span>Посада</span>
          <span>Видимість</span>
          <span>Дата оновлення</span>
          <span>Дії</span>
        </div>

        {items.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400">Вакансії відсутні. Додайте першу вакансію.</div>
        ) : (
          <DndSortableList
            items={items}
            onReorder={handleReorder}
            renderItem={(vacancy, index) => {
              const hasEnPair = Boolean(getEnVersion(vacancy));
              const updatedAt = vacancy.updatedAt
                ? new Date(vacancy.updatedAt).toLocaleDateString("uk-UA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "—";

              return (
                <div className="grid grid-cols-[40px_1fr_120px_160px_80px] items-center border-b border-gray-100 px-6 py-4 last:border-0 hover:bg-gray-50">
                  <span className="text-sm text-gray-400">{index !== undefined ? index + 1 : ""}</span>
                  <span className="text-sm font-medium">{vacancy.position}</span>

                  {/* Видимість — toggle */}
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(vacancy);
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      disabled={!hasEnPair}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        !hasEnPair
                          ? "cursor-not-allowed bg-gray-200 opacity-40"
                          : vacancy.isActive
                            ? "bg-blue-500"
                            : "bg-gray-300"
                      }`}
                      aria-label={vacancy.isActive ? "Приховати" : "Показати"}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                          vacancy.isActive ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Дата оновлення */}
                  <span className="text-sm text-gray-400">{updatedAt}</span>

                  {/* Дії */}
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(vacancy.id);
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="rounded-full p-1.5 hover:bg-gray-100"
                      aria-label="Редагувати"
                    >
                      <EditIcon className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingVacancy(vacancy);
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      disabled={!hasEnPair}
                      className={`rounded-full p-1.5 ${!hasEnPair ? "cursor-not-allowed opacity-40" : "hover:bg-red-50"}`}
                      aria-label="Видалити"
                    >
                      <TrashIcon className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              );
            }}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deletingVacancy)}
        onClose={() => setDeletingVacancy(null)}
        handleConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Видалити вакансію"
        content={`Ви впевнені, що хочете видалити "${deletingVacancy?.position}"? Цю дію не можна скасувати.`}
        confirmButtonText="Видалити"
        cancelButtonText="Скасувати"
      />
    </div>
  );
};
