"use client";

import { useRef, useEffect } from "react";

import { useMounted, useOutsideClick } from "@/hooks";
import { Portal } from "../portal";
import { getStyles } from "./style";

interface IModal {
  isOpen: boolean;
  className?: string;
  closeModal: () => void;
  children?: React.ReactNode;
}

export const Modal = ({ isOpen, className, children, closeModal }: IModal) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { isUnmounted } = useMounted({ isOpened: isOpen, duration: 300 });

  useOutsideClick(() => closeModal(), modalRef);

  const style = getStyles({ isOpen });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const currentCount = parseInt(document.body.getAttribute("data-modals-open") || "0", 10);
    const newCount = currentCount + 1;

    document.body.setAttribute("data-modals-open", newCount.toString());

    if (newCount === 1) {
      const scrollWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollWidth}px`;
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const countDuringCleanup = parseInt(document.body.getAttribute("data-modals-open") || "1", 10);
      const updatedCount = countDuringCleanup - 1;

      if (updatedCount <= 0) {
        document.body.removeAttribute("data-modals-open");

        timerRef.current = setTimeout(() => {
          if (!document.body.hasAttribute("data-modals-open")) {
            document.body.style.overflow = "unset";
            document.body.style.paddingRight = "0px";
          }
        }, 300);
      } else {
        document.body.setAttribute("data-modals-open", updatedCount.toString());
      }
    };
  }, [isOpen]);

  return (
    <Portal opened={isUnmounted}>
      <div className={style.overlay} onClick={closeModal}>
        <div ref={modalRef} className={className} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </Portal>
  );
};
