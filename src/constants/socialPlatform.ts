import {
  ViberIcon,
  TiktokIcon,
  DiscordIcon,
  TwitterIcon,
  YoutubeIcon,
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
  InstagramIcon,
} from "../../public/icons";
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

export const socialPlatformsIconsMap: Record<SocialPlatform, ComponentType<SVGProps<SVGSVGElement>>> = {
  [SocialPlatform.X]: TwitterIcon,
  [SocialPlatform.VIBER]: ViberIcon,
  [SocialPlatform.TIKTOK]: TiktokIcon,
  [SocialPlatform.DISCORD]: DiscordIcon,
  [SocialPlatform.YOUTUBE]: YoutubeIcon,
  [SocialPlatform.FACEBOOK]: FacebookIcon,
  [SocialPlatform.LINKEDIN]: LinkedinIcon,
  [SocialPlatform.TELEGRAM]: TelegramIcon,
  [SocialPlatform.WHATSAPP]: WhatsappIcon,
  [SocialPlatform.INSTAGRAM]: InstagramIcon,
};
