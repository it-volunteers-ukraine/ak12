import { SubdivisionsSection, VacanciesSection } from "@/components";
import { DEFAULT_PAGE, DEFAULT_TYPE } from "@/constants/pagination";
import { Locale } from "@/types";
import { VacancyType } from "@/types/vacancy";

export interface SearchParamsProps {
  type?: VacancyType;
  page?: string;
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
        <VacanciesSection type={type} page={page} />
      </main>
    </>
  );
}
