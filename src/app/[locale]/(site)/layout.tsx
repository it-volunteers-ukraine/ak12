import { SECTION_KEYS } from "@/constants";
import { Footer, Header } from "@/components";
import { contentService } from "@/lib/content/content.service";
import { feedbackContentSchema, headerAndFooterContentSchema } from "@/schemas";

type SiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { locale } = await params;
  const validLocale = locale === "en" ? "en" : "uk";
  const [contentHeader, contentFeedback] = await Promise.all([
    contentService.get({
      locale: validLocale,
      schema: headerAndFooterContentSchema,
      section: SECTION_KEYS.HEADER,
    }),
    contentService.get({
      locale: validLocale,
      schema: feedbackContentSchema,
      section: SECTION_KEYS.FEEDBACK,
    }),
  ]);

  return (
    <>
      <Header content={contentHeader?.header ?? null} socialLinks={contentFeedback?.contacts?.socialLinks || null} />
      <main>{children}</main>
      <Footer
        content={contentHeader?.footer ?? null}
        menu={contentHeader?.header.links || null}
        contacts={contentFeedback?.contacts ?? null}
      />
    </>
  );
}
