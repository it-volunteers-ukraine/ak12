"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { SubmenuItem } from "./mok";

import { AdminViewSiteButton } from "@/components/admin";

interface IAdminHeaderProps {
  sidebarSegment: string;
  contentMenu: SubmenuItem[];
}

export const AdminHeader = ({ contentMenu, sidebarSegment }: IAdminHeaderProps) => {
  const params = useParams();

  const activeSubsection = params.subsidebar as string;
  const locale = params.locale as string;

  return (
    <header className="sticky top-0 z-50 mb-6 flex justify-between gap-6 border-b bg-white p-4">
      <div className="flex gap-6">
        {contentMenu.map((item: SubmenuItem) => {
          const subId = item.id.toLowerCase();
          const href = `/${locale}/admin/${sidebarSegment}/${subId}`;

          const isActive = activeSubsection === subId;

          return (
            <Link
              href={href}
              key={item.id}
              className={`pb-2 transition-all ${
                isActive ? "border-b-2 border-blue-500 font-bold text-blue-500" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <AdminViewSiteButton />
    </header>
  );
};
