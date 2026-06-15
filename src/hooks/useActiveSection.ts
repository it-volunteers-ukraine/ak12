"use client";

import { useState, useEffect } from "react";

export const useActiveSection = (sectionIds: string[]) => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const updateActiveSection = () => {
      const center = window.innerHeight / 2;

      let activeId = "";

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);

        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();

        if (rect.top <= center && rect.bottom >= center) {
          activeId = id;
        }
      });

      setActiveSection(activeId);
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [sectionIds]);

  return activeSection;
};
