import { z } from "zod";

import { SocialPlatform } from "@/constants";

export const contactSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Href is required"),
});

export const socialLinkSchema = z.object({
  platform: z.enum(SocialPlatform, { message: "Invalid social platform" }),
  href: z.string().min(1, "Href is required"),
});

export const contactsContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  copyright: z.string().min(1, "Copyright is required"),
  copyrightOwner: z.string().min(1, "Copyright owner is required"),

  socialLinks: z.array(socialLinkSchema),
  contacts: z.array(contactSchema),
});

export type SocialLink = z.infer<typeof socialLinkSchema>;
export type ContactsContent = z.infer<typeof contactsContentSchema>;
