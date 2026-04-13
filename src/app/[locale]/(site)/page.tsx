import { Locale } from "@/types";
import { VacancyType } from "@/types/vacancy";
import { LifeOfTheUnit } from "@/components/life-of-the-unit";
import { DEFAULT_PAGE, DEFAULT_TYPE } from "@/constants/vacancies";
import { getVacancies } from "@/actions/vacancies/get-vacancies.action";
import { VacanciesSection, SubdivisionsSection, MarqueeLine } from "@/components";

export interface SearchParamsProps {
  page?: string;
  type?: VacancyType;
}

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<SearchParamsProps>;
}) {
  const { locale } = await params;

  const type = (await searchParams).type || DEFAULT_TYPE;

  const page = Number((await searchParams).page) || DEFAULT_PAGE;

  const { vacancies } = await getVacancies();

  const vacanciesTitleList = vacancies.map((item) => item.position);

  return (
    <>
      <main>
        <SubdivisionsSection locale={locale} />
        <LifeOfTheUnit locale={locale} />
        <VacanciesSection type={type} page={page} vacancies={vacancies} />
        <MarqueeLine itemList={vacanciesTitleList} />
      </main>
    </>
  );
}
