"use client";
import { FeedbackFormContent } from "@/schemas";
import { FeedbackForm } from "../feedback-form";
import { CloseIcon } from "../../../public/icons";

import { Modal } from "../modal";

interface FeedbackModalProps {
  content: FeedbackFormContent;
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal = ({ content, isOpen, onClose }: FeedbackModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      closeModal={onClose}
      className="bg-surface-main absolute top-0 flex w-full flex-col items-center px-4 pt-21 pb-9"
    >
      <button
        type="button"
        onClick={onClose}
        className="hover:text-accent focus:text-accent absolute top-4 right-0 p-4 text-white transition-colors"
      >
        <CloseIcon className="h-6 w-6" />
      </button>
      <h2 className="font-ermilov text-accent mb-7 text-center text-[32px]/10">{content.modalTitle}</h2>
      <FeedbackForm content={content} isModal />
    </Modal>
  );
};
