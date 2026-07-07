import { createNavigation } from "next-intl/navigation";
import { defaultLocale, locales } from "@/constants/locales";

export const { usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
});
