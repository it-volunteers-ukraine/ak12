import { Locale } from "@/types";
import { FeedbackForm } from "../feedback-form";
import { DirectContact } from "./direct-contact";
import { ResponseTime } from "./response-time";
import { SocialMedia } from "./social-media";
import { contentService } from "@/lib/content/content.service";
import { contactsContentSchema, feedbackContentSchema } from "@/schemas";
import { SECTION_KEYS } from "@/constants";

interface FeedbackSectionProps {
  locale: Locale;
}

export const FeedbackSection = async ({ locale }: FeedbackSectionProps) => {
  const content = await contentService.get({ locale, schema: feedbackContentSchema, section: SECTION_KEYS.FEEDBACK });
  const contacts = await contentService.get({ locale, schema: contactsContentSchema, section: SECTION_KEYS.CONTACTS });

  if (!content) {
    return null;
  }

  return (
    <section className="bg-section overflow-hidden px-20 py-25" id="contacts">
      <h2 className="font-ermilov text-accent mb-16 text-center text-[56px] font-bold uppercase">
        {content.form.title}
      </h2>
      <div className="flex w-full gap-5">
        <FeedbackForm content={content.form} />
        <div className="flex w-103.5 flex-col justify-between">
          {contacts?.contacts && <DirectContact title={content.directContactTitle} contacts={contacts.contacts} />}
          <ResponseTime title={content.responseTimeTitle} description={content.responseTimeDescription} />
          {contacts?.socialLinks && <SocialMedia title={content.socialMediaTitle} socialLinks={contacts.socialLinks} />}
        </div>
      </div>
    </section>
  );
};
