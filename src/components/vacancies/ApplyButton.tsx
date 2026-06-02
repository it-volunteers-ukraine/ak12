"use client";

import { useState } from "react";

import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { FeedbackModal } from "../feedback-modal";
import { SubmitIcon } from "../../../public/icons";
import { FeedbackFormContentWithMessage, PrivacyPolicyContent } from "@/schemas";

const DEFAULT_CONTENT: FeedbackFormContentWithMessage = {
  title: "Подати заявку",
  modalTitle: "Залишити повідомлення",
  descriptionInputTitle: "Ваше повідомлення",
  descriptionInputPlaceholder: "Напишіть нам детально про ваш запит...",
  radioButtonsTitle: "Тема звернення",
  radioButtons: [{ label: "Вакансія" }],
  buttonSubmit: "Відправити повідомлення",
  privacyPolicyTitle: "Натискаючи кнопку, ви погоджуєтесь з нашою",
  privacyPolicyTextLink: "Політикою конфіденційності",
};

interface ApplyButtonProps {
  className?: string;
  textButton?: string;
  contentModal: FeedbackFormContentWithMessage | null;
  privacyPolicyContent: PrivacyPolicyContent | null;
}

export const ApplyButton = ({ className, textButton, contentModal, privacyPolicyContent }: ApplyButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("vacancies");

  const content = contentModal ?? DEFAULT_CONTENT;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "bg-surface-main border-accent hover:bg-hover mt-auto flex w-full items-center justify-center gap-1 border-2 py-1.5 transition-colors",
          className,
        )}
      >
        <span className="font-ermilov text-soft-blush text-[20px] leading-7 font-bold">{textButton || t("apply")}</span>
        <SubmitIcon className="h-4.5 w-4.5" />
      </button>
      <FeedbackModal
        isOpen={isOpen}
        content={content}
        onClose={() => setIsOpen(false)}
        privacyPolicyContent={privacyPolicyContent}
      />
    </>
  );
};
