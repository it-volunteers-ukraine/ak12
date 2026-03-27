import { ReactNode } from "react";

import Sidebar from "@/components/admin/sidebar";
/* import { getAllSections } from "@/actions/get-all-sections";
 */
type SiteLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
    section?: string;
    subsidebar?: string;
  }>;
};

export default async function SidebarPage({ children /* params */ }: SiteLayoutProps) {
  /*   const { locale } = await params;
  const normalizedLocale = locale === "uk" ? "uk" : "en";

  const sections = await getAllSections(normalizedLocale);

  console.log("sections", sections); */

  return (
    <div className="mx-auto max-w-292 pl-64">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
