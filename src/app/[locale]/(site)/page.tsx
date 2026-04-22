import { Locale } from "@/types";
import { VacancyType } from "@/types/vacancy";
import { LifeOfTheUnit } from "@/components/life-of-the-unit";
import { FeedbackSection } from "@/components/feedback-section";
import { DEFAULT_PAGE, DEFAULT_TYPE } from "@/constants/vacancies";
import { getVacancies } from "@/actions/vacancies/get-vacancies.action";
import { SubdivisionsSection, MarqueeLine } from "@/components";
import { VacanciesSection } from "@/components/vacancies";

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
        <LifeOfTheUnit locale={locale} />
        <SubdivisionsSection locale={locale} />
        <VacanciesSection type={type} page={page} vacancies={vacancies} />
        <FeedbackSection locale={locale} />
        <MarqueeLine itemList={vacanciesTitleList} />
      </main>
    </>
  );
}
