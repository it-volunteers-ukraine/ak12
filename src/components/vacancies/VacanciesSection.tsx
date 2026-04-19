import { getTranslations } from "next-intl/server";
import { VacancyCard } from "./VacancyCard";
import { VacancyTabs } from "./VacancyTabs";
import { VacancyMapped, VacancyType } from "@/types/vacancy";
import { LoadMoreLink } from "./LoadMoreLink";
import { DEFAULT_LIMIT } from "@/constants/vacancies/pagination";

export interface Props {
  type: VacancyType;
  page: number;
  vacancies: VacancyMapped[];
}

export async function VacanciesSection({ type, page, vacancies }: Props) {
  const t = await getTranslations("vacancies");

  const filteredVacancies = vacancies.filter((v) => v.type === type);

  const visibleVacancies = filteredVacancies.slice(0, (page + 1) * DEFAULT_LIMIT);

  const total = filteredVacancies.length;

  const loaded = visibleVacancies.length;

  const remainingVacancies = total - loaded;

  return (
    <section className="bg-surface-main text-secondary-text px-20 py-25" id="vacancy">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-ermilov text-accent mb-16 text-center text-[56px] leading-32 font-bold tracking-[-3px] uppercase">
          {t("title")}
        </h2>

        <VacancyTabs currentType={type} />

        {visibleVacancies.length > 0 ? (
          <ul className="tablet:grid-cols-2 desktop:grid-cols-3 grid gap-x-5 gap-y-9">
            {visibleVacancies.map((v) => v.isActive && <VacancyCard key={v.id} vacancy={v} />)}
          </ul>
        ) : (
          <p className="text-center">{t("noResults")}</p>
        )}
        {remainingVacancies > 0 && (
          <LoadMoreLink type={type} nextPage={page + 1} remainingVacancies={remainingVacancies} />
        )}
      </div>
    </section>
  );
}
