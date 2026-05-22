"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { AdminViewSiteButton } from "@/components/admin";

import { SubmenuItem } from "./mok";
import { CheckIcon } from "../../../../public/icons";

interface IAdminHeaderProps {
  sidebarSegment: string;
  contentMenu: SubmenuItem[];
}

export const AdminHeader = ({ contentMenu, sidebarSegment }: IAdminHeaderProps) => {
  const params = useParams();

  const activeSubsection = params.subsidebar as string;
  const locale = params.locale as string;

  return (
    <header className="sticky top-0 z-50 flex justify-between gap-6 border-b-3 bg-white">
      <div className="flex w-full items-center justify-between gap-6 bg-[#F8F9FA]">
        <div className="flex overflow-x-auto">
          {contentMenu.map((item: SubmenuItem) => {
            const subId = item.id.toLowerCase();
            const href = `/${locale}/admin/${sidebarSegment}/${subId}`;

            const isActive = activeSubsection === subId;

            return (
              <div
                key={item.id}
                className={`mb-2 h-22 w-77 shrink-0 px-2 transition-all duration-200 ease-in-out ${isActive ? "bg-white font-bold" : "hover:bg-gray-200/40"}`}
              >
                <Link href={href} className="flex h-full gap-2">
                  <div className="mt-6 h-6 w-6">
                    <CheckIcon width={24} height={24} className="h-full w-full object-cover" />
                  </div>

                  <div>
                    {item.label}
                    <div className="flex w-fit flex-col justify-end text-end text-[#697077]/60">
                      <span className="text-sm]">Оновлено: 09.08.2026.</span>
                      <span className="text-sm"> Час: 22:12. </span>
                      <span className="text-sm"> Europe/Kyiv</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        <AdminViewSiteButton />
      </div>
    </header>
  );
};
