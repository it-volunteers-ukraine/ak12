import { Locale } from "@/types";
import { VacanciesSection, SubdivisionsSection } from "@/components";

export default async function Home({ params }: { params: { locale: Locale } }) {
  const { locale } = await params;

  return (
    <>
      <main className="p-6 text-3xl">
        <SubdivisionsSection locale={locale} />
        <VacanciesSection />
      </main>
    </>
  );
}
