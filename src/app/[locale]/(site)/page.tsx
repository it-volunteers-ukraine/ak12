import { Locale } from "@/types";
import { SECTION_KEYS } from "@/constants";
import { VacancyType } from "@/types/vacancy";
import { AboutSection } from "@/components/about";
import { DEFAULT_TYPE } from "@/constants/vacancies";
import { getSubdivisions } from "@/actions/subdivisions";
import { VacanciesSection } from "@/components/vacancies";
import { JoinUsSection } from "@/components/contract-18-24";
import { contentService } from "@/lib/content/content.service";
import { FeedbackSection } from "@/components/feedback-section";
import { MarqueeLine, SubdivisionsSection } from "@/components";
import { getVacancies } from "@/actions/vacancies/get-vacancies.action";
import { HeroSection, LifeOfTheCorpsSection } from "@/components/sections";
import {
  aboutUsSchema,
  transferSchema,
  heroContentSchema,
  contract1824Schema,
  mobilizationSchema,
  privacyPolicySchema,
  feedbackContentSchema,
} from "@/schemas";

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

  const [
    { vacancies: allVacancies },
    contentFeedback,
    contentPrivacyPolicy,
    mobilizationContent,
    contract1824Content,
    transferContent,
  ] = await Promise.all([
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
    contentService.get({
      locale,
      schema: mobilizationSchema,
      section: SECTION_KEYS.MOBILIZATION,
    }),
    contentService.get({
      locale,
      schema: contract1824Schema,
      section: SECTION_KEYS.CONTRACT_18_24,
    }),
    contentService.get({
      locale,
      schema: transferSchema,
      section: SECTION_KEYS.TRANSFER,
    }),
  ]);

  const contentJoinUs = {
    mobilization: mobilizationContent,
    contract1824: contract1824Content,
    transfer: transferContent,
  };

  const vacancies = allVacancies.filter((v) => v.isActive);
  const vacanciesTitleList = vacancies.map((item) => item.position);

  const heroContent = await contentService.get({
    locale,
    schema: heroContentSchema,
    section: SECTION_KEYS.HERO,
  });

  const aboutContent = await contentService.get({
    locale,
    schema: aboutUsSchema,
    section: SECTION_KEYS.ABOUT,
  });

  const feedbackContent = await contentService.get({
    locale,
    schema: feedbackContentSchema,
    section: SECTION_KEYS.FEEDBACK,
  });

  const contentSubdivisions = await getSubdivisions(locale);

  return (
    <>
      <main>
        <HeroSection content={heroContent} />
        <AboutSection content={aboutContent} />
        <LifeOfTheCorpsSection content={aboutContent} />
        <SubdivisionsSection content={contentSubdivisions} />
        <VacanciesSection
          vacancies={vacancies}
          initialType={initialType}
          contentModal={contentFeedback?.form ?? null}
          privacyPolicyContent={contentPrivacyPolicy}
        />
        <JoinUsSection
          contentJoinUs={contentJoinUs}
          contentModal={contentFeedback?.form ?? null}
          privacyPolicyContent={contentPrivacyPolicy}
        />
        <FeedbackSection locale={locale} privacyPolicyContent={contentPrivacyPolicy} content={feedbackContent} />
        <MarqueeLine itemList={vacanciesTitleList} />
      </main>
    </>
  );
}
