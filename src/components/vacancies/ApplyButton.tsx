"use client";

import { useState } from "react";
import { FeedbackModal } from "../feedback-modal";
import { FeedbackFormContent } from "@/schemas";
import { useTranslations } from "next-intl";

export const ApplyButton = ({ contentModal }: { contentModal: FeedbackFormContent }) => {
  const [isOpen, setIsOpen] = useState(false);

  const t = useTranslations("vacancies");

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-auto rounded-lg border border-black px-4 py-2 text-center text-sm transition-colors hover:bg-gray-100"
      >
        {t("apply")}
      </button>
      <FeedbackModal content={contentModal} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
