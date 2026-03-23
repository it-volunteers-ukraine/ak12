import { Locale } from "@/types";
import { HomePage, SubdivisionsSection } from "@/components";

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main className="text-3xl p-6">
      <HomePage />
      <SubdivisionsSection locale={locale} />
    </main>
  );
}
