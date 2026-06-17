import { sectionIds } from "@/constants/section-key";

export const scrollToSection = (id: string) => {
  const positionsSections = calculateSectionsPositions();

  const scrollTo = positionsSections.find((s) => s.id === id)?.position ?? 0;

  window.scrollTo({
    top: scrollTo,
    behavior: "smooth",
  });
};

type SectionWithPosition = {
  id: string;
  position: number;
};

const calculateSectionsPositions = (): SectionWithPosition[] => {
  const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

  if (!isBrowser) {
    return [];
  }

  let currentPosition = -80;

  return sectionIds.map((section) => {
    const result = {
      id: section,
      position: currentPosition,
    };

    const element = document.getElementById(result.id ?? "");

    const height = element?.offsetHeight ?? 0;

    currentPosition += height;

    return result;
  });
};
