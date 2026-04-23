import { AdminHeader } from "@/components/admin";
import { sidebarToSubmenuMap } from "@/components/admin/header-menu/mok";

export default function DivisionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const topMenu = sidebarToSubmenuMap["divisions"] || [];

  return (
    <>
      <AdminHeader contentMenu={topMenu} sidebarSegment="divisions" />
      <main>{children}</main>
    </>
  );
}