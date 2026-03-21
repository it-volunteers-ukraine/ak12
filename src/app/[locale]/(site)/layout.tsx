import { ReactNode } from "react";

import Link from "next/link";

import { Locale } from "@/types";
import { getHeaderContentByLocale } from "@/actions/header";

type SiteLayoutProps = {
    children: ReactNode;
    params: Promise<{
        locale: string;
    }>;
};

export default async function SiteLayout({
    params,
    children,
}: SiteLayoutProps) {
    const locale = (await params).locale as Locale;
    const normalizedLocale: Locale = locale === "uk" ? "uk" : "en";
    const headerContent = await getHeaderContentByLocale(normalizedLocale);

    console.log(headerContent);

    return (
        <>
            {headerContent && (
                <div className="flex gap-3 items-center justify-between px-4 py-3">
                    {headerContent.links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
            {children}
        </>
    );
}
