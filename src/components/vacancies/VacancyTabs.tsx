import { VACANCY_TYPES } from "@/constants/vacancies/filters";
import { VacancyType } from "@/types/vacancy";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function VacancyTabs({ currentType }: { currentType: VacancyType }) {
  const t = await getTranslations("vacancies");

  const base =
    "px-8 py-4 font-ermilov font-bold text-center text-[32px] leading-8 tracking-[0px] border border-accent transition-colors";

  const active = "bg-accent text-surface-secondary";
  const inactive = "bg-surface-secondary text-accent hover:bg-hover";

  return (
    <div className="mb-9 flex justify-center">
      {VACANCY_TYPES.map((type) => (
        <Link
          key={type}
          href={`?type=${type}`}
          className={`${base} ${currentType === type ? active : inactive}`}
          scroll={false}
        >
          {t(type)}
        </Link>
      ))}
    </div>
  );
}
