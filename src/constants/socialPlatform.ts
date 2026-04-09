import { FacebookIcon, YoutubeIcon } from "../../public/icons";
import { ComponentType, SVGProps } from "react";

export enum SocialPlatform {
  X = "x",
  VIBER = "viber",
  TIKTOK = "tiktok",
  DISCORD = "discord",
  YOUTUBE = "youtube",
  FACEBOOK = "facebook",
  LINKEDIN = "linkedin",
  TELEGRAM = "telegram",
  WHATSAPP = "whatsapp",
  INSTAGRAM = "instagram",
}

//TODO: add icons for all platforms
export const socialPlatformsIconsMap: Record<SocialPlatform, ComponentType<SVGProps<SVGSVGElement>>> = {
  [SocialPlatform.X]: FacebookIcon,
  [SocialPlatform.VIBER]: FacebookIcon,
  [SocialPlatform.TIKTOK]: FacebookIcon,
  [SocialPlatform.DISCORD]: FacebookIcon,
  [SocialPlatform.YOUTUBE]: YoutubeIcon,
  [SocialPlatform.FACEBOOK]: FacebookIcon,
  [SocialPlatform.LINKEDIN]: FacebookIcon,
  [SocialPlatform.TELEGRAM]: FacebookIcon,
  [SocialPlatform.WHATSAPP]: FacebookIcon,
  [SocialPlatform.INSTAGRAM]: FacebookIcon,
};
