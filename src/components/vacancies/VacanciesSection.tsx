"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { VacancyType, VacancyMapped } from "@/types/vacancy";
import { VACANCY_TYPES } from "@/constants/vacancies/filters";
import { DEFAULT_LIMIT } from "@/constants/vacancies/pagination";
import { FeedbackFormContent, PrivacyPolicyContent } from "@/schemas";
import { VacancyCard } from "./VacancyCard";

export interface Props {
  vacancies: VacancyMapped[];
  initialType: VacancyType;
  contentModal: FeedbackFormContent | null;
  privacyPolicyContent: PrivacyPolicyContent | null;
}

export function VacanciesSection({ vacancies, initialType, contentModal, privacyPolicyContent }: Props) {
  const t = useTranslations("vacancies");
  const [activeType, setActiveType] = useState<VacancyType>(initialType);
  const [page, setPage] = useState(0);

  const handleTabChange = (type: VacancyType) => {
    setActiveType(type);
    setPage(0);
  };

  const filteredVacancies = useMemo(() => vacancies.filter((v) => v.type === activeType), [vacancies, activeType]);

  const visibleVacancies = filteredVacancies.slice(0, (page + 1) * DEFAULT_LIMIT);
  const remainingVacancies = filteredVacancies.length - visibleVacancies.length;

  const tabBase =
    "px-4 py-3 font-road-ui font-bold text-[20px] leading-[140%] text-center border border-accent transition-colors";
  const activeClass = "bg-accent text-surface-secondary";
  const inactiveClass = "bg-surface-secondary text-accent hover:bg-hover";

  return (
    <section className="bg-surface-main text-secondary-text tablet:py-25 desktop:py-40 py-16" id="vacancy">
      <div className="container-app">
        <h2 className="font-ermilov text-accent tablet:text-[40px] tablet:leading-[120%] tablet:mb-14 desktop:text-[56px] desktop:leading-[114%] desktop:mb-16 mb-4 text-center text-[32px] leading-[125%] font-bold capitalize">
          {t("title")}
        </h2>
        <div className="tablet:mb-12 desktop:mb-16 mb-8 flex justify-center">
          {VACANCY_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleTabChange(type)}
              className={`${tabBase} ${activeType === type ? activeClass : inactiveClass}`}
            >
              {t(type)}
            </button>
          ))}
        </div>

        {visibleVacancies.length > 0 ? (
          <ul className="vacancies-grid tablet:grid-cols-2 tablet:gap-4 laptop:grid-cols-3 laptop:gap-x-5 laptop:gap-y-8 grid grid-cols-1 gap-[13px]">
            {visibleVacancies.map((v) => (
              <VacancyCard
                key={v.id}
                vacancy={v}
                contentModal={contentModal}
                privacyPolicyContent={privacyPolicyContent}
              />
            ))}
          </ul>
        ) : (
          <p className="text-warm-gray text-center">{t("noResults")}</p>
        )}

        {remainingVacancies > 0 && (
          <div className="tablet:mt-12 desktop:mt-16 mt-7 flex justify-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="font-ermilov tablet:text-[18px] text-accent bg-surface-secondary border-accent hover:bg-hover border px-10 py-3 text-[16px] leading-[150%] font-bold transition-colors"
            >
              {t("showMore")} {remainingVacancies}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
