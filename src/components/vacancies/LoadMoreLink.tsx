import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { VacancyType } from "@/types/vacancy";

export interface Props {
  nextPage: number;
  type: VacancyType;
  remainingVacancies: number;
}

export async function LoadMoreLink({ type, nextPage, remainingVacancies }: Props) {
  const t = await getTranslations("vacancies");

  return (
    <div className="flex justify-center">
      <Link
        href={`?type=${type}&page=${nextPage}`}
        className="font-ermilov text-accent bg-surface-secondary border-accent hover:bg-hover border px-[45.5px] py-3 text-[18px] leading-8 tracking-[0px] transition-colors"
        scroll={false}
      >
        {t("showMore")} {remainingVacancies}
      </Link>
    </div>
  );
}
