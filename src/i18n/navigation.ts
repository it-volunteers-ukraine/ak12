import { defaultLocale, locales } from "@/constants/locales";
import { createNavigation } from "next-intl/navigation";

export const { usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
});
