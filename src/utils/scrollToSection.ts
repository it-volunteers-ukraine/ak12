const staticSectionCache: Record<string, number> = {};

let isCacheReady = false;

const buildSiteMap = () => {
  if (typeof window === "undefined" || isCacheReady) {return};

  const sections = Array.from(document.querySelectorAll("main section, [id]")) as HTMLElement[];

  sections.forEach((section) => {
    if (section.id) {
      // Зчитуємо поточний інлайновий top від хука
      const styleTop = section.style.top;
      const topOffset = styleTop ? parseFloat(styleTop) : 0; 
      
      // Чиста координата без врахування зміщення хука
      let cleanAbsoluteTop = section.offsetTop - topOffset;

      // КОРЕКЦІЯ: Якщо хук уже підтягнув велику секцію вгору (topOffset мінусовий),
      // додаємо цю різницю, щоб скрол доїжджав чітко до верхньої межі контенту,
      // не захоплюючи попередню секцію.
      if (topOffset < 0) {
        cleanAbsoluteTop = section.offsetTop;
      }

      staticSectionCache[section.id] = cleanAbsoluteTop;
    }
  });

  isCacheReady = true;
};

export const scrollToSection = (sectionId: string) => {
  if (typeof window === "undefined") {return};

  if (!isCacheReady) {
    buildSiteMap();
  }

  window.history.replaceState(null, "", `#${sectionId}`);

  const header = document.querySelector("header");
  const headerHeight = header?.getBoundingClientRect().height ?? 0;

  let targetTop = staticSectionCache[sectionId];

  if (targetTop === undefined) {
    const target = document.getElementById(sectionId);
    
    if (!target) {return};
    targetTop = target.getBoundingClientRect().top + window.scrollY;
  }

  // Додаємо невеликий запас (наприклад, замість 8px поставимо 0 або 2px, 
  // щоб секція ставала впритул до хедера)
  const finalScrollPosition = Math.max(0, targetTop - headerHeight);

  window.scrollTo({
    top: finalScrollPosition,
    behavior: "smooth",
  });
};
