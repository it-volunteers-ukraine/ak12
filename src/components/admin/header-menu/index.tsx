"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { SubmenuItem } from "./mok";

interface IAdminHeaderProps {
  sidebarSegment: string;
  contentMenu: SubmenuItem[];
}

export const AdminHeader = ({ contentMenu, sidebarSegment }: IAdminHeaderProps) => {
  const params = useParams();

  const activeSubsection = params.subsidebar as string;
  const locale = params.locale as string;

  return (
    <header className="sticky top-0 flex gap-6 border-b bg-white p-4">
      {contentMenu.map((item: SubmenuItem) => {
        const subId = item.id.toLowerCase();
        const href = `/${locale}/admin/${sidebarSegment}/${subId}`;

        const isActive = activeSubsection === subId;

        return (
          <Link
            key={item.id}
            href={href}
            className={`pb-2 transition-all ${
              isActive ? "border-b-2 border-blue-500 font-bold text-blue-500" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </header>
  );
};
