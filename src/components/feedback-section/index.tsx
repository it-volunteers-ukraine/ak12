import { Locale } from "@/types";
import { FeedbackForm } from "../feedback-form";
import { DirectContact } from "./direct-contact";
import { ResponseTime } from "./response-time";
import { SocialMedia } from "./social-media";
import { contentService } from "@/lib/content/content.service";
import { feedbackContentSchema, privacyPolicySchema } from "@/schemas";
import { SECTION_KEYS } from "@/constants";

interface FeedbackSectionProps {
  locale: Locale;
}

export const FeedbackSection = async ({ locale }: FeedbackSectionProps) => {
  const [content, contentPrivacyPolicy] = await Promise.all([
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

  if (!content) {
    return null;
  }

  return (
    <section
      className="bg-card-bg desktop-xl:py-40 desktop:py-30 desktop:px-20 tablet:bg-section tablet:py-25 tablet:px-10 px-4 pt-6 pb-10"
      id="contacts"
    >
      <h2 className="font-ermilov text-accent desktop:text-[56px] desktop:mb-16 tablet:text-[40px] tablet:mb-8 mb-7 text-center text-[32px] font-bold">
        {content.form?.title}
      </h2>
      <div className="desktop:flex gap-5">
        {content.form && <FeedbackForm content={content.form} privacyPolicyContent={contentPrivacyPolicy} />}
        <div className="desktop:m-0 desktop:gap-7.5 desktop-xl:min-w-180.75 desktop:min-w-103.5 tablet:grid-cols-3 desktop:grid-cols-1 tablet:mt-12 mt-7 grid gap-4">
          {content.contacts?.info && (
            <DirectContact title={content.directContactTitle} contacts={content.contacts.info} />
          )}

          <ResponseTime title={content.responseTimeTitle} description={content.responseTimeDescription} />

          {content?.contacts?.socialLinks && (
            <SocialMedia title={content.socialMediaTitle} socialLinks={content?.contacts?.socialLinks} />
          )}
        </div>
      </div>
    </section>
  );
};
