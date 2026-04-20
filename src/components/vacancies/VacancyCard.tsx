import { SECTION_KEYS } from "@/constants";
import { contentService } from "@/lib/content/content.service";
import { feedbackContentSchema } from "@/schemas";
import { Locale } from "@/types";
import { VacancyMapped } from "@/types/vacancy";
import { formatSalary } from "@/utils/vacancies/format-salary";

import { getTranslations } from "next-intl/server";
import { ApplyButton } from "./ApplyButton";

interface Props {
  vacancy: VacancyMapped;
  locale: Locale;
}

export async function VacancyCard({ vacancy, locale }: Props) {
  const t = await getTranslations("vacancies");

  const salaryMin = formatSalary(vacancy.salaryMin);

  const salaryMax = vacancy.salaryMax ? formatSalary(vacancy.salaryMax) : null;

  const contentFeedback = await contentService.get({
    locale,
    schema: feedbackContentSchema,
    section: SECTION_KEYS.FEEDBACK,
  });

  return (
    <li className="flex h-full flex-col rounded-xl border border-gray-200 p-6 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="mb-4 text-lg font-semibold">{vacancy.position}</h3>
      <p className="mb-4 text-gray-600">
        <span className="pr-1 font-medium text-black">{t("salary")}:</span>
        {salaryMax ? `${salaryMin} - ${salaryMax}` : `${t("from")} ${salaryMin}`} {t("currency")}
      </p>
      <p className="mb-6 line-clamp-3 text-gray-600">
        <span className="pr-1 font-medium text-black">{t("requirements")}:</span>
        {vacancy.description}
      </p>
      {contentFeedback && <ApplyButton contentModal={contentFeedback.form} />}
    </li>
  );
}
