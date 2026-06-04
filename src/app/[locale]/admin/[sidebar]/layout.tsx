import { notFound } from "next/navigation";

import type { Locale } from "@/types";
import { AdminHeader } from "@/components/admin";
import { getDynamicSidebarMenu } from "@/lib/admin/sidebar-menu";
import { sidebarToSubmenuMap } from "@/components/admin/header-menu/mok";

export default async function SectionLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; sidebar: string }>;
}) {
  const { locale, sidebar } = await params;
  const currentSidebar = sidebar?.toLowerCase();

  const isValidSidebar = currentSidebar === "content" || currentSidebar in sidebarToSubmenuMap;

  if (!isValidSidebar) {
    notFound();
  }

  const topMenu =
    currentSidebar === "content"
      ? await getDynamicSidebarMenu((locale === "en" ? "en" : "uk") as Locale, currentSidebar)
      : sidebarToSubmenuMap[currentSidebar];

  return (
    <>
      <AdminHeader contentMenu={topMenu} sidebarSegment={sidebar} />
      <main>{children}</main>
    </>
  );
}
