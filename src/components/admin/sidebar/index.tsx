"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutForm } from "@/components/auth/logout-form";

import { SidebarLogo } from "./sidebar-logo";
import { mainAdminNavigation, sidebarToSubmenuMap } from "../header-menu/mok";

interface IAdminSidebarProps {
  content: {
    logoText?: string | null;
    logoImg?: {
      secureUrl?: string;
    } | null;
  } | null;
}

export const Sidebar = ({ content }: IAdminSidebarProps) => {
  const pathname = usePathname();
  const logoContent = {
    logoImg: content?.logoImg,
    logoText: content?.logoText || "ADMIN",
  };

  return (
    <aside className="fixed top-0 left-0 flex h-screen w-64 flex-col gap-16 border-r border-gray-200 bg-white px-4 py-6">
     <SidebarLogo content={logoContent} />
      <div className="flex h-full flex-1 flex-col justify-between">
        <nav className="space-y-1">
          {mainAdminNavigation?.map((item) => {
            const IconComponent = item.icon;
            const slug = item.id.toLowerCase();
            const firstSub = sidebarToSubmenuMap[slug]?.[0] || "index";
            const href = `/admin/${slug}/${firstSub.id?.toLowerCase()}`;

            const currentPath = pathname.toLowerCase();

            const isActive = currentPath.includes(`/admin/${slug}`);

            return (
              <div
                key={item.label}
                className={`flex gap-3 rounded-lg px-4 py-2 ${
                  isActive ? "bg-admin-menu-active-background" : "hover:bg-gray-100"
                }`}
              >
                <IconComponent width={24} height={24} className="shrink-0" />
                <Link href={href}>{item.label}</Link>
              </div>
            );
          })}
        </nav>

        <LogoutForm />
      </div>
    </aside>
  );
};
