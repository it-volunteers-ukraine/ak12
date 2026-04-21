"use client";

import { useState } from "react";
import { FeedbackModal } from "../feedback-modal";
import { FeedbackFormContent } from "@/schemas";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const ApplyButton = ({ contentModal }: { contentModal: FeedbackFormContent }) => {
  const [isOpen, setIsOpen] = useState(false);

  const t = useTranslations("vacancies");

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-surface-main border-accent hover:bg-hover mt-auto flex w-full items-center justify-center gap-1 border-2 py-1.5 transition-colors"
      >
        <span className="font-ermilov text-soft-blush text-[20px] leading-7 font-bold">{t("apply")}</span>
        <Image src="/icons/apply-arrow.svg" alt="" width={18} height={18} />
      </button>
      <FeedbackModal content={contentModal} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
