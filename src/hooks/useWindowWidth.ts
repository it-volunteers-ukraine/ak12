import { useLayoutEffect, useState } from "react";

import { IUseWidowWidthProps } from "@/types";
import { media } from "@/constants";

export function useWindowWidth(): IUseWidowWidthProps {
  const [width, setWidth] = useState<number>(0);
  const { tablet, laptop, desktop, desktopXL } = media;

  useLayoutEffect(() => {
    function updateSize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return {
    width,
    isMobile: width < tablet,
    isTablet: width >= tablet,
    isLaptop: width >= laptop,
    isNotMobile: width > tablet,
    isDesktop: width >= desktop,
    isNotDesktop: width < desktop,
    isDesktopXL: width >= desktopXL,
  };
}
