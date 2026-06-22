import type { Locale } from "@/types";
import type { SectionKey } from "@/constants";
import { ADMIN_SCHEMAS } from "@/lib/admin";
import { contentService } from "@/lib/content/content.service";
import { type SubmenuItem, sidebarToSubmenuMap } from "@/components/admin/header-menu/mok";

export const getDynamicSidebarMenu = async (locale: Locale, currentSidebar: string): Promise<SubmenuItem[]> => {
  const menuItems = sidebarToSubmenuMap[currentSidebar] || [];

  const sectionKeys = menuItems.map((item) => item.id as SectionKey).filter((key) => !!ADMIN_SCHEMAS[key]);

  const timestampsMap = await contentService.getBatchWithLatestTimestamps({
    locale,
    sections: sectionKeys,
  });

  return menuItems.map((item) => {
    const sectionKey = item.id as SectionKey;
    const schema = ADMIN_SCHEMAS[sectionKey];

    if (!schema) {
      return {
        ...item,
        updatedAt: undefined,
      };
    }

    const updatedAt = timestampsMap[sectionKey];

    return {
      ...item,
      updatedAt: updatedAt ?? undefined,
    };
  });
};
