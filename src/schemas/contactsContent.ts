import { z } from "zod";

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

export const contactSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Href is required"),
});

export const socialLinkSchema = z.object({
  platform: z.enum(SocialPlatform, { message: "Invalid social platform" }),
  href: z.string().min(1, "Href is required"),
});

export const contactsContentSchema = z.object({
  socialLinks: z.array(socialLinkSchema),
  contacts: z.array(contactSchema),
});

export type SocialLink = z.infer<typeof socialLinkSchema>;
export type ContactsContent = z.infer<typeof contactsContentSchema>;
