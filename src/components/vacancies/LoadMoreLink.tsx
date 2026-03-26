import { VacancyType } from "@/types/vacancy";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export interface Props {
  type: VacancyType;
  nextPage: number;
  remainingVacancies: number;
}
export async function LoadMoreLink({ type, nextPage, remainingVacancies }: Props) {
  const t = await getTranslations("vacancies");

  return (
    <div className="mt-10 flex justify-center">
      <Link
        href={`?type=${type}&page=${nextPage}`}
        className="rounded-lg border border-black px-4 py-2 text-center text-sm transition-colors hover:bg-gray-100"
        scroll={false}
      >
        {t("showMore")} {remainingVacancies}
      </Link>
    </div>
  );
}
