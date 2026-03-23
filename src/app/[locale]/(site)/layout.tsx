import { ReactNode } from "react";

import { Locale, MenuContent } from "@/types";
import menuContentJson from "@/data/menuContent.json";
import { Footer, Header } from "@/components";

type SiteLayoutProps = {
    children: ReactNode;
    params: Promise<{
        locale: string;
    }>;
};

const getMenuContent = (locale: Locale): MenuContent => {
    return menuContentJson[locale] || menuContentJson.uk;
};

export default async function SiteLayout({
    children,
    params,
}: SiteLayoutProps) {
    const { locale } = await params;
    const normalizedLocale: Locale = locale === "uk" ? "uk" : "en";
    const menuContent = getMenuContent(normalizedLocale);

    return (
        <>
            <Header content={menuContent} />
            {children}
            <Footer content={menuContent} locale={normalizedLocale} />
        </>
    );
}