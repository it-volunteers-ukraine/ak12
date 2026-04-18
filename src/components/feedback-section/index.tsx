import { Locale } from "@/types";
import { FeedbackForm } from "../feedback-form";
import { DirectContact } from "./direct-contact";
import { ResponseTime } from "./response-time";
import { SocialMedia } from "./social-media";
import { contentService } from "@/lib/content/content.service";
import { feedbackContentSchema } from "@/schemas";
import { SECTION_KEYS } from "@/constants";

interface FeedbackSectionProps {
  locale: Locale;
}

export const FeedbackSection = async ({ locale }: FeedbackSectionProps) => {
  const content = await contentService.get({ locale, schema: feedbackContentSchema, section: SECTION_KEYS.FEEDBACK });

  if (!content) {
    return null;
  }

  return (
    <section className="bg-section px-20 py-25">
      <h2 className="font-ermilov text-accent mb-16 text-center text-[56px] font-bold uppercase">
        {content.form.title}
      </h2>
      <FeedbackForm content={content.form} />
      <DirectContact title={content.directContactTitle} />
      <ResponseTime title={content.responseTimeTitle} description={content.responseTimeDescription} />
      <SocialMedia title={content.socialMediaTitle} />
    </section>
  );
};
