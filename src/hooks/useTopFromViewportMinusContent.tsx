"use client";

import { RefObject, useEffect, useState } from "react";

export function useTopFromViewportMinusContent<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [top, setTop] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element || typeof window === "undefined") {
      return;
    }

    const updateTop = () => {
      const contentHeight = element.clientHeight;
      const nextTop = Math.min(0, window.innerHeight - contentHeight);

      setTop(nextTop);
    };

    updateTop();

    let timeoutId: ReturnType<typeof setTimeout>;

    const debouncedUpdateTop = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        updateTop();
      }, 100);
    };

    const resizeObserver = new ResizeObserver(() => {
      debouncedUpdateTop();
    });

    resizeObserver.observe(element);
    window.addEventListener("resize", debouncedUpdateTop);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedUpdateTop);
      clearTimeout(timeoutId);
    };
  }, [ref]);

  return top;
}
