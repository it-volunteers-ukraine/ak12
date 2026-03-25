import { SubdivisionsSection, VacanciesSection } from "@/components";
import { Locale } from "@/types";

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
