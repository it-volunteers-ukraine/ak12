import { useState } from "react";
import { Modal } from "../modal";
import { PrivacyPolicyContent } from "@/schemas";

interface IPolicyButton {
  text: string;
  textLink: string;
  privacyPolicyContent: PrivacyPolicyContent | null;
}

export const PolicyButton = ({ text, textLink, privacyPolicyContent }: IPolicyButton) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex">
        <p className="text-warm-gray mr-1 text-[12px]">{text} </p>
        <button className="text-accent text-[12px]" type="button" onClick={() => setIsOpen(true)}>
          {textLink}
        </button>
      </div>
      <Modal
        className="flex w-100 flex-col gap-8 rounded-md border border-green-100 bg-green-50 p-8 shadow-md shadow-green-200"
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      >
        <div>
          <h3>{privacyPolicyContent?.title}</h3>
          <p className="whitespace-pre-line">{privacyPolicyContent?.description}</p>
        </div>
        <button className="text-[12px]" type="button" onClick={() => setIsOpen(false)}>
          Закрити
        </button>
      </Modal>
    </>
  );
};
