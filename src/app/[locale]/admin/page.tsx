import { redirect } from "next/navigation";

import { sidebarToSubmenuMap } from "@/components/admin/header-menu/mok";

export default async function AdminPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    const sections = Object.keys(sidebarToSubmenuMap);

    const firstSection = sections[0];

    const firstSub = sidebarToSubmenuMap[firstSection]?.[0]?.id || "index";

    redirect(`/${locale}/admin/${firstSection}/${firstSub}`);
}
