"use client";

import { Modal } from "@/components/modal";

import { ModalTitle, ModalFooter, ModalContent } from "./modal-parts";

interface IConfirmModal {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}
type TConfirmModal = React.FC<IConfirmModal> & {
  ModalTitle: typeof ModalTitle;
  ModalFooter: typeof ModalFooter;
  ModalContent: typeof ModalContent;
};

export const ConfirmModal: TConfirmModal = ({ isOpen, children, onClose }: IConfirmModal) => {
  return (
    <Modal isOpen={isOpen} closeModal={onClose} className="flex min-h-screen items-center justify-center">
      <div className="flex w-100 -translate-y-16 flex-col gap-8 rounded-md border border-green-100 bg-green-50 p-8 shadow-md shadow-green-200">
        {children}
      </div>
    </Modal>
  );
};

ConfirmModal.ModalTitle = ModalTitle;
ConfirmModal.ModalFooter = ModalFooter;
ConfirmModal.ModalContent = ModalContent;
