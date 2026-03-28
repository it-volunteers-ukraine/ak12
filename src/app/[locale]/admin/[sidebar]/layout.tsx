import AdminHeader from "@/components/admin/header-menu";
import { sidebarToSubmenuMap } from "@/components/admin/header-menu/mok";

export default async function SectionLayout({
    params,
    children,
}: {
    children: React.ReactNode;
    params: Promise<{ sidebar: string }>;
}) {
    const { sidebar } = await params;

    const topMenu = sidebarToSubmenuMap[sidebar?.toLowerCase()] || [];

    return (
        <>
            <AdminHeader
                contentMenu={topMenu}
                sidebarSegment={sidebar}
            />
            <main className="p-6">{children}</main>
        </>
    );
}
