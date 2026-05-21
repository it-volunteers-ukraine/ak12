// VacancyCard.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { VacancyMapped } from "@/types/vacancy";
import { formatSalary } from "@/utils/vacancies/format-salary";
import { FeedbackFormContent } from "@/schemas";
import { ApplyButton } from "./ApplyButton";

interface Props {
  vacancy: VacancyMapped;
  contentModal: FeedbackFormContent | null;
}

const DESCRIPTION_LIMIT = 120;

export function VacancyCard({ vacancy, contentModal }: Props) {
  const t = useTranslations("vacancies");
  const [isExpanded, setIsExpanded] = useState(false);

  const salaryMin = formatSalary(vacancy.salaryMin);
  const salaryMax = vacancy.salaryMax ? formatSalary(vacancy.salaryMax) : null;

  const isLong = vacancy.description.length > DESCRIPTION_LIMIT;
  const displayedDescription =
    isLong && !isExpanded ? vacancy.description.slice(0, DESCRIPTION_LIMIT).trimEnd() + "..." : vacancy.description;

  return (
    <li
      className="tablet:p-6 flex flex-col rounded-[2px] p-4 backdrop-blur-[5px] transition-transform hover:-translate-y-0.5"
      style={{
        border: "1px solid var(--stroke-green-24)",
        boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.08)",
        background: "linear-gradient(177deg, #1a1a1a 8%, #1a1e1d 72%)",
      }}
    >
      <div className="border-accent/8 mb-4 border-b pb-4">
        <h3 className="font-ermilov text-accent mb-3 text-[18px] leading-[144%] font-bold uppercase">
          {vacancy.position}
        </h3>
        <div className="flex flex-wrap items-baseline gap-x-1">
          <span className="font-road-ui text-warm-gray text-[14px] leading-[157%] font-medium">{t("salary")}:</span>
          <span className="font-road-ui text-soft-blush text-[14px] leading-[157%] font-bold">
            {salaryMax ? `${salaryMin} - ${salaryMax}` : `${t("from")} ${salaryMin}`} {t("currency")}
          </span>
        </div>
      </div>

      <p className="font-road-ui text-soft-blush mb-2 text-[14px] leading-[157%] font-medium">{displayedDescription}</p>

      {isLong ? (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="font-road-ui text-accent tablet:mb-8 mb-6 self-start text-[14px] leading-[157%] font-medium hover:underline"
        >
          {isExpanded ? t("readLess") : t("readMore")}
        </button>
      ) : (
        <div className="tablet:mb-8 mb-6" />
      )}
      <div className="mt-auto">
        <ApplyButton contentModal={contentModal} />
      </div>
    </li>
  );
}
