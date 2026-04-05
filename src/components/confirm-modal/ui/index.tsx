"use client";

import { useRef } from "react";

import { useOutsideClick } from "@/hooks";
import { Overlay } from "@/components/overlay";

import { ModalBody, ModalFooter, ModalHeader } from "./modal-parts";

interface IConfirmModal {
  isOpen: boolean;
  children?: React.ReactNode;
  setIsOpen: (isOpen: boolean) => void;
}
type TConfirmModal = React.FC<IConfirmModal> & {
  ModalBody: typeof ModalBody;
  ModalFooter: typeof ModalFooter;
  ModalHeader: typeof ModalHeader;
};

export const ConfirmModal: TConfirmModal = ({ isOpen, children, setIsOpen }: IConfirmModal) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(() => setIsOpen(false), modalRef);

  return (
    <Overlay isOpen={isOpen}>
      <div className="flex min-h-screen items-center justify-center">
        <div
          ref={modalRef}
          className="flex w-100 -translate-y-16 flex-col gap-8 rounded-md border border-green-100 bg-green-50 p-8 shadow-md shadow-green-200"
        >
          {children}
        </div>
      </div>
    </Overlay>
  );
};

ConfirmModal.ModalBody = ModalBody;
ConfirmModal.ModalHeader = ModalHeader;
ConfirmModal.ModalFooter = ModalFooter;
