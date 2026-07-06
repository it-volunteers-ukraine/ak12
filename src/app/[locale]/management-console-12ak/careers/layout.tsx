import { AdminHeader } from "@/components/admin";
import { sidebarToSubmenuMap } from "@/components/admin/header-menu/mok";

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const topMenu = sidebarToSubmenuMap["careers"] || [];

  return (
    <>
      <AdminHeader contentMenu={topMenu} sidebarSegment="careers" />
      <div>{children}</div>
    </>
  );
}