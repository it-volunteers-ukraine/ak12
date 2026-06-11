import { HeaderLinks } from "@/schemas";

type SectionWithPosition = HeaderLinks[number] & {
  position: number;
};

export const calculateSectionsPositions = (sections: HeaderLinks): SectionWithPosition[] => {
  let currentPosition = 0;

  const newSections = [...sections];

  newSections.splice(0, 0, { label: "hero", idSection: "hero" });
  newSections.splice(2, 0, { label: "life-of-the-corps", idSection: "life-of-the-corps" });

  return newSections.map((section) => {
    const result = {
      ...section,
      position: currentPosition,
    };

    const element = document.getElementById(section.idSection ?? "");

    const height = element?.offsetHeight ?? 0;

    currentPosition += height;

    return result;
  });
};
