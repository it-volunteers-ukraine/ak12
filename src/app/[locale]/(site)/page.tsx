import { Locale } from "@/types";
import { SECTION_KEYS } from "@/constants";
import { VacancyType } from "@/types/vacancy";
import { feedbackContentSchema, privacyPolicySchema } from "@/schemas";
import { DEFAULT_TYPE } from "@/constants/vacancies";
import { VacanciesSection } from "@/components/vacancies";
import { contentService } from "@/lib/content/content.service";
import { FeedbackSection } from "@/components/feedback-section";
import { MarqueeLine, SubdivisionsSection } from "@/components";
import { getVacancies } from "@/actions/vacancies/get-vacancies.action";
import { HeroSection, LifeOfTheCorpsSection } from "@/components/sections";
import { AboutSection } from "@/components/about";

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

  const [{ vacancies: allVacancies }, contentFeedback, contentPrivacyPolicy] = await Promise.all([
    getVacancies(),
    contentService.get({
      locale,
      schema: feedbackContentSchema,
      section: SECTION_KEYS.FEEDBACK,
    }),
    contentService.get({
      locale,
      schema: privacyPolicySchema,
      section: SECTION_KEYS.PRIVACY_POLICY,
    }),
  ]);

  const vacancies = allVacancies.filter((v) => v.isActive);
  const vacanciesTitleList = vacancies.map((item) => item.position);

  return (
    <>
      <main>
        <HeroSection locale={locale} />
        <AboutSection locale={locale} />   
        <LifeOfTheCorpsSection locale={locale} />
        <SubdivisionsSection locale={locale} />
        <VacanciesSection
          vacancies={vacancies}
          initialType={initialType}
          contentModal={contentFeedback?.form ?? null}
          privacyPolicyContent={contentPrivacyPolicy}
        />
        <FeedbackSection locale={locale} privacyPolicyContent={contentPrivacyPolicy} />
        <MarqueeLine itemList={vacanciesTitleList} />
      </main>
    </>
  );
}
