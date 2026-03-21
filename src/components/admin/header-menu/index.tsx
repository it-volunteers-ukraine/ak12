"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { SubmenuItem } from "./mok";

interface IAdminHeaderProps {
    sidebarSegment: string;
    contentMenu: SubmenuItem[];
}

export default function AdminHeader({
    contentMenu,
    sidebarSegment,
}: IAdminHeaderProps) {
    const params = useParams();

    const activeSubsection = params.subsidebar as string;
    const locale = params.locale as string;

    return (
        <header className="flex gap-6 p-4 border-b bg-white sticky top-0">
            {contentMenu.map((item: SubmenuItem) => {
                const subId = item.id.toLowerCase();
                const href = `/${locale}/admin/${sidebarSegment}/${subId}`;

                const isActive = activeSubsection === subId;

                return (
                    <Link
                        key={item.id}
                        href={href}
                        className={`pb-2 transition-all ${
                            isActive
                                ? "border-b-2 border-blue-500 font-bold text-blue-500"
                                : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        {item.section_key}
                    </Link>
                );
            })}
        </header>
    );
}
