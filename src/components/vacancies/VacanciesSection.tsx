"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { VacancyType, VacancyMapped } from "@/types/vacancy";
import { VACANCY_TYPES } from "@/constants/vacancies/filters";
import { DEFAULT_LIMIT } from "@/constants/vacancies/pagination";
import { FeedbackFormContent } from "@/schemas";
import { VacancyCard } from "./VacancyCard";

export interface Props {
  vacancies: VacancyMapped[];
  initialType: VacancyType;
  contentModal: FeedbackFormContent | null;
}

export function VacanciesSection({ vacancies, initialType, contentModal }: Props) {
  const t = useTranslations("vacancies");
  const [activeType, setActiveType] = useState<VacancyType>(initialType);
  const [page, setPage] = useState(0);

  const handleTabChange = (type: VacancyType) => {
    setActiveType(type);
    setPage(0);
  };

  const filteredVacancies = useMemo(
    () => vacancies.filter((v) => v.type === activeType && v.isActive),
    [vacancies, activeType],
  );

  const visibleVacancies = filteredVacancies.slice(0, (page + 1) * DEFAULT_LIMIT);
  const remainingVacancies = filteredVacancies.length - visibleVacancies.length;

  const base =
    "px-8 py-4 font-ermilov font-bold text-center text-[32px] leading-8 tracking-[0px] border border-accent transition-colors";
  const activeClass = "bg-accent text-surface-secondary";
  const inactiveClass = "bg-surface-secondary text-accent hover:bg-hover";

  return (
    <section className="bg-surface-main text-secondary-text px-20 py-25" id="vacancy">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-ermilov text-accent mb-16 text-center text-[56px] leading-32 font-bold tracking-[-3px] uppercase">
          {t("title")}
        </h2>

        <div className="mb-9 flex justify-center">
          {VACANCY_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleTabChange(type)}
              className={`${base} ${activeType === type ? activeClass : inactiveClass}`}
            >
              {t(type)}
            </button>
          ))}
        </div>

        {visibleVacancies.length > 0 ? (
          <ul className="tablet:grid-cols-2 desktop:grid-cols-3 grid gap-8">
            {visibleVacancies.map((v) => (
              <VacancyCard key={v.id} vacancy={v} contentModal={contentModal} />
            ))}
          </ul>
        ) : (
          <p className="text-center">{t("noResults")}</p>
        )}

        {remainingVacancies > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="font-ermilov text-accent bg-surface-secondary border-accent hover:bg-hover border px-[45.5px] py-3 text-[18px] leading-8 tracking-[0px] transition-colors"
            >
              {t("showMore")} {remainingVacancies}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}