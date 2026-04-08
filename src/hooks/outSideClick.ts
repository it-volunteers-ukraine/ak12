"use client";

import { RefObject, useEffect } from "react";

type OutsideClickRef = RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[];

const useOutsideClick = (callback: () => void, refs: OutsideClickRef) => {
  const refArray = Array.isArray(refs) ? refs : [refs];

  const handleClick = (e: MouseEvent) => {
    const isOutside = refs && refArray.every((ref) => ref && ref.current && !ref.current.contains(e.target as Node));

    if (isOutside) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [refs, callback]);
};

export { useOutsideClick };
