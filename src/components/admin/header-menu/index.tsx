'use client';

import Link from "next/link";
import { useParams } from "next/navigation";

import { AdminViewSiteButton } from "@/components/admin";

import { SubmenuItem } from "./mok";

interface IAdminHeaderProps {
  sidebarSegment: string;
  contentMenu: SubmenuItem[];
}

export const AdminHeader = ({ contentMenu, sidebarSegment }: IAdminHeaderProps) => {
  const params = useParams();
  const timeZone = "Europe/Kyiv";
  const showUpdatedAt = sidebarSegment === "content";

  const activeSubsection = params.subsidebar as string;
  const locale = params.locale as string;

  return (
    <header className="sticky top-0 z-50 flex justify-between gap-6 border-b-3 bg-white">
      <div className="flex w-full items-center justify-between gap-6 bg-[#F8F9FA] pr-3">
        <div className="flex overflow-x-auto">
          {contentMenu.map((item: SubmenuItem) => {
            const subId = item.id.toLowerCase();
            const href = `/${locale}/admin/${sidebarSegment}/${subId}`;

            const isActive = activeSubsection === subId;

            return (
              <div
                key={item.id}
                className={`mb-2 w-fit shrink-0 p-2 pr-6 transition-all duration-200 ease-in-out ${isActive ? "bg-white font-bold" : "hover:bg-gray-200/40"}`}
              >
                <Link href={href} className="flex h-full gap-2">
                  <div>
                    <span className="text-xl">{item.label}</span>
                    {showUpdatedAt && (
                      <div className="flex gap-3 text-[#697077]/60">
                        <span className="text-sm">
                          Оновлено:{" "}
                          {item.updatedAt
                            ? new Date(item.updatedAt).toLocaleDateString("uk-UA", {
                                timeZone,
                              })
                            : "---"}
                        </span>
                        <span className="text-sm">
                          {item.updatedAt
                            ? new Date(item.updatedAt).toLocaleTimeString("uk-UA", {
                                timeZone,
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "---"}
                        </span>
                      </div>
                    )}
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
