"use client";

import z from "zod";
import Image from "next/image";
import { useState } from "react";

import { Modal } from "../modal";
import { MobileNav } from "./mobileNav";
import { DesktopNav } from "./desktopNav";
import { BlobButton } from "../blobButton";
import { Logo } from "../../../public/images";
import { SocialLinkList } from "../socialLinkList";
import LanguageSwitcher from "../language-switcher";
import { useActiveSection, useWindowWidth } from "@/hooks";
import { BarsIcon, HeartIcon } from "../../../public/icons";
import { headerContentSchema, SocialLink } from "@/schemas";

export type HeaderProps = {
  socialLinks: SocialLink[] | null;
  content: z.infer<typeof headerContentSchema> | null;
};

export const Header = ({ content, socialLinks }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { isTablet, isDesktop } = useWindowWidth();

  const links = content?.links ?? [];
  const button = content?.button;

  const sectionIds = links.map((l) => l.idSection).filter((id): id is string => id !== null);

  const activeSection = useActiveSection(sectionIds);

  const logoText = isDesktop ? content?.logoText : content?.subLogoText;

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <header className="bg-card-bg tablet:px-10 tablet:py-5 desktop:px-20 fixed z-50 flex w-full items-center justify-between px-4 py-3">
      <div className="flex h-12 items-center gap-5">
        <Image src={Logo} alt="Company logo" className="tablet:h-10 tablet:w-8.75 h-6 w-[21]" />
        <p className="text-[20px] font-bold text-white">{logoText || "Logo"}</p>
      </div>

      <div className="flex items-center">
        <DesktopNav links={links} activeSection={activeSection} />

        {isTablet && button?.text && button?.href && (
          <BlobButton href={button.href}>
            <span className="text-soft-blush font-ermilov flex items-center gap-1 text-[16px]">
              {button.text}
              <HeartIcon className="h-4 w-4" />
            </span>
          </BlobButton>
        )}

        <div className="desktop-xl:gap-6 ml-12 flex items-center gap-4">
          {socialLinks && isTablet && <SocialLinkList socialLinks={socialLinks} />}

          <LanguageSwitcher />

          {!isDesktop && (
            <button
              aria-label="Open menu"
              onClick={openModal}
              className="text-soft-blush hover:text-accent/50 focus:text-accent/50 p-2.5"
            >
              <BarsIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        className="w-[calc(100%-80px)]"
        classNameOverlay="bg-surface-main/81"
      >
        <MobileNav links={links} activeSection={activeSection} onClose={closeModal} />
      </Modal>
    </header>
  );
};
