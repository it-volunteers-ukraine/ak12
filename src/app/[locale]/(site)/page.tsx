import { HomePage } from "@/components";
import { SubdivisionsSection } from "@/components/subdivisions/subdivisions-section";
import { Locale } from "@/types";

interface PageProps {
    params: Promise<{ locale: Locale }>;
}

export default async function Home({ params }: PageProps) {
    const { locale } = await params;

    return (
        <main>
            <HomePage />
            <SubdivisionsSection locale={locale} />
        </main>
    );
}