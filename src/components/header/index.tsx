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
        <Image src={Logo} alt="Company logo" className="tablet:h-10 tablet:w-8.75 h-6 w-[21]" />
        <p className="flex justify-center text-white">
          <span className="tablet:hidden font-bold">{content?.subLogoText || "Logo"}</span>
          <span className="tablet:block hidden text-[20px] font-bold">{content?.logoText || "Logo"}</span>
        </p>
      </div>

      <div className="flex items-center">
        <Nav links={links} />

        {button?.text && button?.href && (
          <BlobButton
            className="tablet:flex desktop:mr-12 desktop:ml-10 desktop-xl:ml-12 mr-10 hidden"
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
