import { Locale } from "@/types";
import { SECTION_KEYS } from "@/constants";
import { VacancyType } from "@/types/vacancy";
import { feedbackContentSchema } from "@/schemas";
import { DEFAULT_TYPE } from "@/constants/vacancies";
import { VacanciesSection } from "@/components/vacancies";
import { contentService } from "@/lib/content/content.service";
import { FeedbackSection } from "@/components/feedback-section";
import { MarqueeLine, SubdivisionsSection } from "@/components";
import { getVacancies } from "@/actions/vacancies/get-vacancies.action";
import { HeroSection, LifeOfTheCorpsSection } from "@/components/sections";

export interface SearchParamsProps {
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
  const initialType = (await searchParams).type || DEFAULT_TYPE;

  const [{ vacancies: allVacancies }, contentFeedback] = await Promise.all([
    getVacancies(),
    contentService.get({
      locale,
      schema: feedbackContentSchema,
      section: SECTION_KEYS.FEEDBACK,
    }),
  ]);

  const vacancies = allVacancies.filter((v) => v.isActive);
  const vacanciesTitleList = vacancies.map((item) => item.position);

  return (
    <>
      <main>
        <HeroSection locale={locale} />
        <LifeOfTheCorpsSection locale={locale} />
        <SubdivisionsSection locale={locale} />
        <VacanciesSection
          vacancies={vacancies}
          initialType={initialType}
          contentModal={contentFeedback?.form ?? null}
        />
        <FeedbackSection locale={locale} />
        <MarqueeLine itemList={vacanciesTitleList} />
      </main>
    </>
  );
}
