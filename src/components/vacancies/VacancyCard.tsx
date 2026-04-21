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
    <li className="border-vacancy-card-stroke/8 from-vacancy-card-start to-vacancy-card-end mb-10 flex flex-col border bg-linear-to-r p-6 transition-transform hover:-translate-y-0.5">
      <div className="border-accent/8 mb-4 border-b pb-4">
        <h3 className="font-ermilov text-accent mb-3 text-[30px] leading-9 font-bold">{vacancy.position}</h3>

        <div className="flex gap-1 text-xs">
          <p className="text-warm-gray leading-4 tracking-[0px]">{t("salary")}:</p>
          <p className="font-ermilov text-soft-blush leading-5 font-bold tracking-[0px]">
            {salaryMax ? `${salaryMin} - ${salaryMax}` : `${t("from")} ${salaryMin}`} {t("currency")}
          </p>
        </div>
      </div>

      <p className="mb-10 text-sm leading-5.5 tracking-[0px]">{vacancy.description}</p>

      {contentFeedback && <ApplyButton contentModal={contentFeedback.form} />}
    </li>
  );
}
