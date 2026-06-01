import type { Locale } from "@/types";
import type { SectionKey } from "@/constants";
import { ADMIN_SCHEMAS } from "@/lib/admin";
import { contentService } from "@/lib/content/content.service";
import { sidebarToSubmenuMap, type SubmenuItem } from "@/components/admin/header-menu/mok";

export const getDynamicSidebarMenu = async (locale: Locale, currentSidebar: string): Promise<SubmenuItem[]> => {
  const menuItems = sidebarToSubmenuMap[currentSidebar] || [];

  return Promise.all(
    menuItems.map(async (item) => {
      const sectionKey = item.id as SectionKey;
      const schema = ADMIN_SCHEMAS[sectionKey];

      if (!schema) {
        return item;
      }

      const updatedAt = await contentService.getUpdatedAt({
        locale,
        section: sectionKey,
      });

      return {
        ...item,
        updatedAt: updatedAt ?? undefined,
      };
    }),
  );
};
