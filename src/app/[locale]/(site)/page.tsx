import { getTranslations } from "next-intl/server";

import { Locale, MenuContent } from "@/types";
import menuContentJson from "@/data/menuContent.json";
import { Footer, Header, HomePage, SubdivisionsSection, VacanciesSection } from "@/components";

const getMenuContent = (locale: Locale): MenuContent => {
  return menuContentJson[locale] || menuContentJson.uk;
};

export default async function Home({ params }: { params: { locale: Locale } }) {
  const { locale } = await params;
  const menuContent = getMenuContent(locale);

  const t = await getTranslations({
    locale: locale,
    namespace: "footer",
  });

  return (
    <>
      <Header content={menuContent} />
      <main className="p-6 text-3xl">
        <HomePage />
        <SubdivisionsSection locale={locale} />
        <VacanciesSection />
      </main>
      <Footer content={menuContent} translations={t} />
    </>
  );
}
