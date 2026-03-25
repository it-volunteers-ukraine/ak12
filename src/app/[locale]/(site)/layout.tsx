import { getTranslations } from "next-intl/server";

import { SECTION_KEYS } from "@/constants";
import { Footer, Header } from "@/components";
import { contactsContentSchema, headerContentSchema } from "@/schemas";
import { contentService } from "@/lib/content/content.service";

type SiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { locale } = await params;
  const validLocale = locale === "en" ? "en" : "uk";

  const contentHeader = await contentService.get({
    locale: validLocale,
    schema: headerContentSchema,
    section: SECTION_KEYS.HEADER,
  });

  const contentContacts = await contentService.get({
    locale: validLocale,
    schema: contactsContentSchema,
    section: SECTION_KEYS.CONTACTS,
  });

  const t = await getTranslations({
    locale: locale,
    namespace: "footer",
  });

  return (
    <>
      <Header content={contentHeader} socialLinks={contentContacts?.socialLinks || null} />
      {children}
      <Footer contactsContent={contentContacts} menu={contentHeader?.links || null} translations={t} />
    </>
  );
}
