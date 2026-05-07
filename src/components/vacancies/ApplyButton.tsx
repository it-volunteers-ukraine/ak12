"use client";

import { useState } from "react";
import { FeedbackModal } from "../feedback-modal";
import { FeedbackFormContent } from "@/schemas";
import { useTranslations } from "next-intl";
import { SubmitIcon } from "../../../public/icons";

const DEFAULT_CONTENT: FeedbackFormContent = {
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

export const ApplyButton = ({ contentModal }: { contentModal: FeedbackFormContent | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("vacancies");

  const content = contentModal ?? DEFAULT_CONTENT;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-surface-main border-accent hover:bg-ho
        ver mt-auto flex w-full items-center justify-center gap-1 border-2 py-1.5 transition-colors"
      >
        <span className="font-ermilov text-soft-blush text-[20px] leading-7 font-bold">
          {t("apply")}
        </span>
        <SubmitIcon className="h-4.5 w-4.5" />
      </button>
      <FeedbackModal content={content} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};