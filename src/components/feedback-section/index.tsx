'use client';

import { useRef } from "react";

import { Locale } from "@/types";
import { FeedbackContent, PrivacyPolicyContent } from "@/schemas";
import { useTopFromViewportMinusContent } from "@/hooks/useTopFromViewportMinusContent";

import { SocialMedia } from "./social-media";
import { ResponseTime } from "./response-time";
import { FeedbackForm } from "../feedback-form";
import { DirectContact } from "./direct-contact";

interface FeedbackSectionProps {
  locale: Locale;
  content: FeedbackContent | null;
  privacyPolicyContent: PrivacyPolicyContent | null;
}

export const FeedbackSection = ({  privacyPolicyContent, content }: FeedbackSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const top = useTopFromViewportMinusContent(sectionRef);

  if (!content) {
    return null;
  }

  return (
    <section
    ref={sectionRef}
      className="bg-card-bg desktop-xl:py-40 desktop:py-30 desktop:px-20 tablet:bg-section tablet:py-25 tablet:px-10 relative px-4 pt-6 pb-10"
      style={{ zIndex: 7, top: `${top}px` }}
      id="contacts"
    >
      <h2 className="font-ermilov text-accent desktop:text-[56px] desktop:mb-16 tablet:text-[40px] tablet:mb-8 mb-7 text-center text-[32px] font-bold">
        {content.form?.title}
      </h2>
      <div className="desktop:flex gap-5">
        {content.form && <FeedbackForm content={content.form} privacyPolicyContent={privacyPolicyContent} />}
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
