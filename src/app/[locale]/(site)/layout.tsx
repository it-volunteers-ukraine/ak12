import { ReactNode } from "react";

import { getHeaderContentByLocale } from "@/actions/header";
import { Header } from "@/components/Header";
import { Locale } from "@/types";

type SiteLayoutProps = {
    children: ReactNode;
    params: Promise<{
        locale: string;
    }>;
};

export default async function SiteLayout({
    children,
    params,
}: SiteLayoutProps) {
    const { locale } = await params;
    const normalizedLocale: Locale = locale === "uk" ? "uk" : "en";
/*     const headerContent = await getHeaderContentByLocale(normalizedLocale); */

    return (
        <>
{/*             {headerContent && (
                <Header
                    locale={normalizedLocale}
                    siteContent={headerContent}
                />
                
            )} */}
            {children}
        </>
    );
}