import { VacancyMapped } from "@/types/vacancy";
import { formatSalary } from "@/utils/vacancies/format-salary";
import { getTranslations } from "next-intl/server";

interface Props {
  vacancy: VacancyMapped;
}

export async function VacancyCard({ vacancy }: Props) {
  const t = await getTranslations("vacancies");

  const salaryMin = formatSalary(vacancy.salaryMin);

  const salaryMax = vacancy.salaryMax ? formatSalary(vacancy.salaryMax) : null;

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
      <a
        href="#apply"
        className="mt-auto rounded-lg border border-black px-4 py-2 text-center text-sm transition-colors hover:bg-gray-100"
      >
        {t("apply")}
      </a>
    </li>
  );
}
