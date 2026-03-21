"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { HeaderLink, HeaderContent } from "@/actions/header";

import { sidebarToSubmenuMap } from "../header-menu/mok";

interface ISidebarProps {
    menu: HeaderContent | null;
}

export default function Sidebar({ menu }: ISidebarProps) {
    const params = useParams();
    const activeSegment = params.sidebar as string;

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-200">
            <div className="p-6 border-b font-bold text-xl text-blue-600">
                ADMIN
            </div>
            <nav className="p-4 space-y-1">
                {menu?.links.map((link: HeaderLink) => {
                    const slug = link.href.replace("#", "").toLowerCase();
                    const firstSub = sidebarToSubmenuMap[slug]?.[0] || "index";
                    const href = `/admin/${slug}/${firstSub.section_key?.toLowerCase()}`;

                    return (
                        <Link
                            key={link.label}
                            href={href}
                            className={`flex px-4 py-2 rounded-lg ${
                                activeSegment === slug
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
