"use client";
import { useEffect, useState } from "react";

interface IMountedProps {
    isOpened: boolean;
    duration?: number;
}

export const useMounted = ({ isOpened, duration = 300 }: IMountedProps) => {
    const [isUnmounted, setIsUnmounted] = useState<boolean>(false);

    if (isOpened && !isUnmounted) {
        setIsUnmounted(true);
    }

    useEffect(() => {
        if (!isOpened && isUnmounted) {
            setTimeout(() => {
                setIsUnmounted(false);
            }, duration);
        }
    }, [isOpened, duration, isUnmounted]);

    return { isUnmounted };
};
