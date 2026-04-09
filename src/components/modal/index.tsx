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
  const { isUnmounted } = useMounted({ isOpened: isOpen, duration: 300 });

  useOutsideClick(() => closeModal(), modalRef);

  const style = getStyles({ isOpen });

  const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth;
  };

  useEffect(() => {
    if (isOpen) {
      const scrollWidth = getScrollbarWidth();

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollWidth}px`;
    } else {
      const timer = setTimeout(() => {
        document.body.style.overflow = "unset";
        document.body.style.paddingRight = "0px";
      }, 300);

      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
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
