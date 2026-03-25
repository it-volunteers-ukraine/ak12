"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { mainAdminNavigation, sidebarToSubmenuMap } from "../header-menu/mok";

export default function Sidebar() {
    const params = useParams();
    const activeSegment = params.sidebar as string;

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-200">
            <div className="p-6 border-b font-bold text-xl text-blue-600">
                ADMIN
            </div>
            <nav className="p-4 space-y-1">
                {mainAdminNavigation?.map((item) => {
                    const slug = item.id.toLowerCase();
                    const firstSub = sidebarToSubmenuMap[slug]?.[0] || "index";
                    const href = `/admin/${slug}/${firstSub.id?.toLowerCase()}`;

                    return (
                        <Link
                            key={item.label}
                            href={href}
                            className={`flex px-4 py-2 rounded-lg ${
                                activeSegment === slug
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
