"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { LogoutForm } from "@/components/auth/logout-form";

import { mainAdminNavigation, sidebarToSubmenuMap } from "../header-menu/mok";

export default function Sidebar() {
  const params = useParams();
  const activeSegment = params.sidebar as string;

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="border-b p-6 text-xl font-bold text-blue-600">ADMIN</div>
      <nav className="space-y-1 p-4">
        {mainAdminNavigation?.map((item) => {
          const slug = item.id.toLowerCase();
          const firstSub = sidebarToSubmenuMap[slug]?.[0] || "index";
          const href = `/admin/${slug}/${firstSub.id?.toLowerCase()}`;

          return (
            <Link
              key={item.label}
              href={href}
              className={`flex rounded-lg px-4 py-2 ${
                activeSegment === slug ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4">
        <LogoutForm />
      </div>
    </aside>
  );
}
