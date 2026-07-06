import { logger } from "@/lib/logger";
import { sectionIds } from "@/constants/section-key";

export const scrollToSection = (id: string) => {
  if (!document.getElementById(id)) {
    logger.warn(`Section with id "${id}" not found in the DOM`);

    return;
  }

  const headerHeight = document.querySelector("header")?.offsetHeight ?? 80;

  let currentPosition = -headerHeight;

  for (const sectionId of sectionIds) {
    if (sectionId === id) {
      break;
    }

    const element = document.getElementById(sectionId);

    currentPosition += element?.offsetHeight ?? 0;
  }

  window.scrollTo({ top: currentPosition, behavior: "smooth" });
};
