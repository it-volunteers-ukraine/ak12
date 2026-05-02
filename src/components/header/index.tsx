import z from "zod";
import Image from "next/image";

import { Nav } from "./nav";
import { BlobButton } from "../blobButton";
import { Logo } from "../../../public/images";
import { SocialLinkList } from "../socialLinkList";
import LanguageSwitcher from "../language-switcher";
import { HeartIcon } from "../../../public/icons";
import { headerContentSchema, SocialLink } from "@/schemas";

export type HeaderProps = {
  socialLinks: SocialLink[] | null;
  content: z.infer<typeof headerContentSchema> | null;
};

export type Links = NonNullable<HeaderProps["content"]>["links"];

export const Header = ({ content, socialLinks }: HeaderProps) => {
  const links = content?.links ?? [];
  const button = content?.button;

  return (
    <header className="bg-card-bg tablet:px-10 tablet:py-5 desktop:px-20 fixed z-50 flex w-full items-center justify-between px-4 py-3">
      <div className="desktop:gap-2 desktop-xl:gap-2.5 flex h-12 items-center gap-1">
        <Image
          width={35}
          height={40}
          alt="Company logo"
          src={content?.logoImg?.secureUrl || Logo}
          className="desktop:h-11.5 desktop:w-10 h-10 w-8.75"
        />
        <p className="flex justify-center text-white">
          <span className="laptop:hidden text-[20px] font-bold">{content?.subLogoText || "Logo"}</span>
          <span className="laptop:block hidden text-[20px] font-bold">{content?.logoText || "Logo"}</span>
        </p>
      </div>

      <div className="flex items-center">
        <Nav links={links} />

        {button?.text && button?.href && (
          <BlobButton
            className="tablet:flex desktop:mr-12 desktop:ml-10 desktop-xl:ml-12 desktop:w-50 mr-10 hidden h-10 w-40"
            href={button.href}
          >
            <span className="text-soft-blush font-ermilov flex items-center gap-1 text-[16px]">
              {button.text}
              <HeartIcon className="h-4 w-4" />
            </span>
          </BlobButton>
        )}

        {socialLinks && <SocialLinkList socialLinks={socialLinks} />}

        <LanguageSwitcher className="tablet:mx-4 desktop:mr-0 desktop-xl:ml-6 mr-1" />
      </div>
    </header>
  );
};
