"use client";
import { useEffect, useState } from "react";

interface IMountedProps {
    isOpened: boolean;
    duration?: number;
}

export const useMounted = ({ isOpened, duration = 300 }: IMountedProps) => {
    const [isUnmounted, setIsUnmounted] = useState<boolean>(false);

    useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isOpened) {
      setIsUnmounted(true);
    } else {
      timeoutId = setTimeout(() => {
        setIsUnmounted(false);
      }, duration);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpened, duration]);

  return { isUnmounted };
};
