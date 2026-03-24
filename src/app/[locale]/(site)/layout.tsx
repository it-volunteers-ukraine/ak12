import { getTranslations } from "next-intl/server";

import { SECTION_KEYS } from "@/constants";
import { Footer, Header } from "@/components";
import { getSafeSectionContent } from "@/actions";
import { contactsContentSchema, headerContentSchema } from "@/schemas";

type SiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { locale } = await params;
  const validLocale = locale === "en" ? "en" : "uk";

const contentHeader = await getSafeSectionContent(SECTION_KEYS.HEADER, validLocale, headerContentSchema);
const contentContacts = await getSafeSectionContent(SECTION_KEYS.CONTACTS, validLocale, contactsContentSchema);

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
