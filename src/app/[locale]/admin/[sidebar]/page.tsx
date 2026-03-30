import { redirect } from "next/navigation";

import { sidebarToSubmenuMap } from "@/components/admin/header-menu/mok";

export default async function SidebarPage({ params }: { params: Promise<{ sidebar: string }> }) {
  const { sidebar } = await params;
  const section = sidebar.toLowerCase();

  const subMenu = sidebarToSubmenuMap[section];

  const firstSub = subMenu && subMenu.length > 0 ? subMenu[0].id : "index";

  redirect(`/admin/${section}/${firstSub}`);
}
