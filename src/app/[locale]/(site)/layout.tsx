import { ReactNode } from "react";

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
    await params;
/*   const normalizedLocale: Locale = locale === "uk" ? "uk" : "en";
     const headerContent = await getHeaderContentByLocale(normalizedLocale); */

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