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
    isLong && !isExpanded
      ? vacancy.description.slice(0, DESCRIPTION_LIMIT).trimEnd() + "..."
      : vacancy.description;

  return (
    <li className="border-vacancy-card-stroke/8 from-vacancy-card-start to-vacancy-card-end mb-10 flex flex-col border bg-linear-to-r p-6 transition-transform hover:-translate-y-0.5">
      <div className="border-accent/8 mb-4 border-b pb-4">
        <h3 className="font-ermilov text-accent mb-3 text-[30px] leading-9 font-bold">
          {vacancy.position}
        </h3>
        <div className="flex gap-1 text-xs">
          <p className="text-warm-gray leading-4 tracking-[0px]">{t("salary")}:</p>
          <p className="font-ermilov text-soft-blush leading-5 font-bold tracking-[0px]">
            {salaryMax ? `${salaryMin} - ${salaryMax}` : `${t("from")} ${salaryMin}`} {t("currency")}
          </p>
        </div>
      </div>

      <p className="mb-2 text-sm leading-5.5 tracking-[0px]">
        {displayedDescription}
      </p>

      {contentFeedback && <ApplyButton contentModal={contentFeedback.form} />}
    </li>
  );
}