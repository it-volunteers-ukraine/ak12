import { VacancyType } from "@/types/vacancy";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function VacancyTabs({ currentType }: { currentType: VacancyType }) {
  const t = await getTranslations("vacancies");

  const base = "text-base text-center tablet:text-xl px-6 py-2 border transition-colors";

  const active = "bg-black text-white border-black";

  const inactive = "bg-white text-gray-600 border-gray-200 hover:bg-gray-100";

  return (
    <div className="mb-6 flex justify-center">
      <Link
        href="?type=backline"
        className={`${base} ${currentType === "backline" ? active : inactive}`}
        scroll={false}
      >
        {t("backline")}
      </Link>

      <Link
        href="?type=frontline"
        className={`${base} ${currentType === "frontline" ? active : inactive}`}
        scroll={false}
      >
        {t("frontline")}
      </Link>
    </div>
  );
}
