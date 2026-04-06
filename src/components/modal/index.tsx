"use client";

import { useRef } from "react";

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

  return (
    <Portal opened={isUnmounted}>
      <div className={style.overlay} onClick={closeModal}>
        <div ref={modalRef} className={className}>
          {children}
        </div>
      </div>
    </Portal>
  );
};
