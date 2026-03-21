import { ReactNode } from "react";

import Sidebar from "@/components/admin/sidebar";
import { getAllSections, getHeaderContentByLocale } from "@/actions/header";

type SiteLayoutProps = {
    children: ReactNode;
    params: Promise<{
        locale: string;
        section?: string;
        subsidebar?: string;
    }>;
};

export default async function SidebarPage({
    params,
    children,
}: SiteLayoutProps) {
    const { locale } = await params;
    const normalizedLocale = locale === "uk" ? "uk" : "en";

    const headerContent = await getHeaderContentByLocale(normalizedLocale);

    const sections = await getAllSections(normalizedLocale);

    console.log("sections", sections);

    return (
        <div className="max-w-292 mx-auto pl-64">
            <Sidebar menu={headerContent} />

            <main>{children}</main>
        </div>
    );
}
