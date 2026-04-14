import { ReactNode } from "react";

import { Sidebar } from "@/components/admin";

type SiteLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
    section?: string;
    subsidebar?: string;
  }>;
};

export default async function SidebarPage({ children }: SiteLayoutProps) {
  return (
    <div className="mx-auto max-w-400 pl-56">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
