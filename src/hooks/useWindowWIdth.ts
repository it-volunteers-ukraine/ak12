import { useLayoutEffect, useState } from 'react';

import { media } from '@/constants';
import { IUseWidowWidthProps } from '@/types';

export function useWindowWidth(): IUseWidowWidthProps {
  const [width, setWidth] = useState<number>(0);
  const { tablet, laptop, desktop, desktopXL } = media;

  useLayoutEffect(() => {
    function updateSize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return {
    width,
    isMobile: width < tablet,
    isNotMobile: width > tablet,
    isTablet: width >= tablet,
    isLaptop: width >= laptop,
    isNotDesktop: width < desktop,
    isDesktop: width >= desktop,
    isDesktopXL: width >= desktopXL,
  };
}
