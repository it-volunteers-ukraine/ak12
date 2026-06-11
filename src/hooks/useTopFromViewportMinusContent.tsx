"use client";

import { useState, RefObject, useEffect } from "react";

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

    const resizeObserver = new ResizeObserver(() => updateTop());

    resizeObserver.observe(element);
    window.addEventListener("resize", updateTop);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateTop);
    };
  }, [ref]);

  return top;
}
