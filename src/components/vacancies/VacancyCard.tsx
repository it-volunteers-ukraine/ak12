import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { VacancyMapped } from "@/types/vacancy";
import { formatSalary } from "@/utils/vacancies/format-salary";

interface Props {
  vacancy: VacancyMapped;
}

export async function VacancyCard({ vacancy }: Props) {
  const t = await getTranslations("vacancies");

  const salaryMin = formatSalary(vacancy.salaryMin);

  const salaryMax = vacancy.salaryMax ? formatSalary(vacancy.salaryMax) : null;

  return (
    <li className="border-vacancy-card-stroke/8 from-vacancy-card-start to-vacancy-card-end mb-10 flex flex-col border bg-linear-to-r p-6 transition-transform hover:-translate-y-0.5">
      <div className="border-accent/8 mb-4 border-b pb-4">
        <h3 className="font-ermilov text-accent mb-3 text-[30px] leading-9 font-bold tracking-[0px]">
          {vacancy.position}
        </h3>

        <div className="flex gap-1 text-xs">
          <p className="text-warm-gray leading-4 tracking-[0px]">{t("salary")}:</p>
          <p className="font-ermilov text-soft-blush leading-5 font-bold tracking-[0px]">
            {salaryMax ? `${salaryMin} - ${salaryMax}` : `${t("from")} ${salaryMin}`} {t("currency")}
          </p>
        </div>
      </div>

      <p className="mb-10 text-sm leading-5.5 tracking-[0px]">{vacancy.description}</p>

      <a
        href="#apply"
        className="bg-surface-main border-accent hover:bg-hover mt-auto flex w-full items-center justify-center gap-1 border-2 py-1.5 transition-colors"
      >
        <span className="font-ermilov text-soft-blush text-[20px] leading-7 font-bold">{t("apply")}</span>

        <Image src="/icons/apply-arrow.svg" alt="" width={18} height={18} />
      </a>
    </li>
  );
}
