import { useState } from "react";
import { ConfirmModal } from "../confirm-modal/ui";

interface IPolicyButton {
  text: string;
  textLink: string;
}

export const PolicyButton = ({ text, textLink }: IPolicyButton) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex">
        <p className="text-warm-gray mr-1 text-[12px]">{text} </p>
        <button className="text-accent text-[12px]" type="button" onClick={() => setIsOpen(true)}>
          {textLink}
        </button>
      </div>
      <ConfirmModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        Політика конфіденційності
        <button className="text-[12px]" type="button" onClick={() => setIsOpen(false)}>
          Закрити
        </button>
      </ConfirmModal>
    </>
  );
};
