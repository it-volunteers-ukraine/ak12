import { Locale } from "@/types";
import { VacancyType } from "@/types/vacancy";
import { HeroSection } from "@/components/sections";
import { VacanciesSection } from "@/components/vacancies";
import { LifeOfTheUnit } from "@/components/life-of-the-unit";
import { FeedbackSection } from "@/components/feedback-section";
import { MarqueeLine, SubdivisionsSection } from "@/components";
import { DEFAULT_TYPE } from "@/constants/vacancies";
import { getVacancies } from "@/actions/vacancies/get-vacancies.action";
import { SECTION_KEYS } from "@/constants";
import { contentService } from "@/lib/content/content.service";
import { feedbackContentSchema } from "@/schemas";

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
        <LifeOfTheUnit locale={locale} />
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