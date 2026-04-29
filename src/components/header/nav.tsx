"use client";

import { useState } from "react";

import { Links } from ".";
import { Modal } from "../modal";
import { NavLinks } from "./navLinks";
import { BarsIcon, CloseIcon } from "../../../public/icons";
import { useActiveSection } from "@/hooks";

export const Nav = ({ links }: { links: Links }) => {
  if (!links) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const sectionIds = links.map((l) => l.idSection).filter((id): id is string => id !== null);

  const activeSection = useActiveSection(sectionIds);

  return (
    <>
      <NavLinks activeSection={activeSection} links={links} type="desktop" />

      <button
        aria-label="Open menu"
        onClick={openModal}
        className="text-soft-blush desktop:hidden hover:text-accent/50 focus:text-accent/50 order-2 p-2.5"
      >
        <BarsIcon className="h-6 w-6" />
      </button>

      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        className="desktop:hidden w-[calc(100%-80px)]"
        classNameOverlay="bg-surface-main/81"
      >
        <button
          onClick={closeModal}
          aria-label="Close menu"
          className="hover:text-accent/50 focus:text-accent/50 p-4 text-white transition-colors"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <NavLinks activeSection={activeSection} links={links} onClickAction={closeModal} type="mobile" />
      </Modal>
    </>
  );
};
