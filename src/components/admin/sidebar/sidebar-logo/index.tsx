import Image from "next/image";

import { Logo } from "../../../../../public/images";

export interface ISidebarLogoConfig {
  content: {
    logoText?: string | null;
    logoImg?: {
      secureUrl?: string;
} | null;
};
}

export const SidebarLogo = ({ content }:  ISidebarLogoConfig) => {
  return (

    <div className="desktop:gap-2 desktop-xl:gap-2.5 flex items-center gap-1">
            {content?.logoImg?.secureUrl && (
        <Image
          width={35}
          height={40}
          alt="Company logo"
          src={content?.logoImg?.secureUrl || Logo}
          className="desktop:h-11.5 desktop:w-10 h-10 w-8.75"
        />
         )}
        <p className="flex justify-center text-white">
          <span className="text-[20px] font-bold text-black">{content?.logoText || "Logo"}</span>
        </p>
      </div>
  );
};
