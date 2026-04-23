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
    <Modal isOpen={isOpen} closeModal={onClose} className="bg-surface-main relative w-[1280px] px-36.5 py-16">
      <button
        type="button"
        onClick={onClose}
        className="hover:text-accent focus:text-accent absolute top-0 right-0 p-6 text-white transition-colors"
      >
        <CloseIcon className="h-12 w-12" />
      </button>
      <h2 className="font-ermilov text-accent mb-16 text-center text-[56px]/16">{content.modalTitle}</h2>
      <FeedbackForm content={content} />
    </Modal>
  );
};
