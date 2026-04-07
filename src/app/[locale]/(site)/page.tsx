import { Locale } from "@/types";
import { VacancyType } from "@/types/vacancy";
import { DEFAULT_PAGE, DEFAULT_TYPE } from "@/constants/vacancies";
import { VacanciesSection, SubdivisionsSection } from "@/components";
import { LifeOfTheUnit } from "@/components/life-of-the-unit";

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

  return (
    <>
      <main className="p-6">
        <SubdivisionsSection locale={locale} />
        <LifeOfTheUnit locale={locale} />
        <VacanciesSection type={type} page={page} />
      </main>
    </>
  );
}
