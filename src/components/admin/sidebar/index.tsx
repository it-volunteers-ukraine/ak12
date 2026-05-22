"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

import { HeaderContent } from "@/schemas";
import { LogoutForm } from "@/components/auth/logout-form";

import { Logo } from "../../../../public/images";
import { mainAdminNavigation, sidebarToSubmenuMap } from "../header-menu/mok";

interface IAdminSidebarProps {
  content: HeaderContent | null;
}

export const Sidebar = ({ content }: IAdminSidebarProps) => {
  const params = useParams();
  const activeSegment = params.sidebar as string;

  return (
    <aside className="fixed top-0 left-0 flex h-screen w-64 flex-col gap-16 border-r border-gray-200 bg-white px-4 py-6">
      <div className="desktop:gap-2 desktop-xl:gap-2.5 flex items-center gap-1">
        <Image
          width={35}
          height={40}
          alt="Company logo"
          src={content?.logoImg?.secureUrl || Logo}
          className="desktop:h-11.5 desktop:w-10 h-10 w-8.75"
        />
        <p className="flex justify-center text-white">
          <span className="text-[20px] font-bold text-black">{content?.logoText || "Logo"}</span>
        </p>
      </div>
      <div className="flex h-full flex-1 flex-col justify-between">
        <nav className="space-y-1">
          {mainAdminNavigation?.map((item) => {
            const IconComponent = item.icon;
            const slug = item.id.toLowerCase();
            const firstSub = sidebarToSubmenuMap[slug]?.[0] || "index";
            const href = `/admin/${slug}/${firstSub.id?.toLowerCase()}`;

            return (
              <div
                key={item.label}
                className={`flex gap-3 rounded-lg px-4 py-2 ${
                  activeSegment === slug ? "bg-admin-menu-active-background" : "hover:bg-gray-100"
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
