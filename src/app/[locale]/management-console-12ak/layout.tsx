import { ReactNode } from "react";

import { Sidebar } from "@/components/admin";
import { SECTION_KEYS } from "@/constants/section-key";
import { headerAndFooterContentSchema } from "@/schemas";
import { contentService } from "@/lib/content/content.service";

type SiteLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
    section?: string;
    subsidebar?: string;
  }>;
};

export default async function SidebarPage({ children, params }: SiteLayoutProps) {
  const { locale } = await params;
  const validLocale = locale === "en" ? "en" : "uk";

  const contentHeader = await contentService.get({
    locale: validLocale,
    schema: headerAndFooterContentSchema,
    section: SECTION_KEYS.HEADER,
  });

  return (
    <div className="mx-auto max-w-460 pl-70">
      <Sidebar content={contentHeader?.header ?? null} />
      <main className="w-full">{children}</main>
    </div>
  );
}
