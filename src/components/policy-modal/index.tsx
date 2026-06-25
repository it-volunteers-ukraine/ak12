import { useState } from "react";
import { Modal } from "../modal";
import { PrivacyPolicyContent } from "@/schemas";
import { CloseIcon } from "../../../public/icons";

interface IPolicyButton {
  text: string;
  textLink: string;
  privacyPolicyContent: PrivacyPolicyContent | null;
}

export const PolicyButton = ({ text, textLink, privacyPolicyContent }: IPolicyButton) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="tablet:flex-row flex flex-col items-center">
        <p className="text-warm-gray mr-1 inline-block text-[12px]">{text} </p>
        <button className="text-accent text-[12px]" type="button" onClick={() => setIsOpen(true)}>
          {textLink}
        </button>
      </div>
      <Modal
        className="bg-surface-main border-accent relative flex h-150 w-180 flex-col border px-8 pt-12 pb-8"
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-soft-blush hover:text-accent focus:text-accent absolute top-6 right-6 transition-colors"
          aria-label={"Закрити"}
        >
          <CloseIcon className="h-6 w-6" />
        </button>
        <h2 className="font-ermilov text-accent mb-6 px-12 text-center text-[20px] leading-[140%] font-bold">
          {privacyPolicyContent?.title}
        </h2>
        <div className="bg-accent mb-6 h-px w-full" />
        <div className="min-h-0 flex-1 overflow-y-auto pr-2">
          <p className="text-soft-blush text-sm leading-7 whitespace-pre-line">{privacyPolicyContent?.description}</p>
        </div>
      </Modal>
    </>
  );
};
