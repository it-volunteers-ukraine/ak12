import { z } from "zod";

export const headerLinkSchema = z.object({
  idSection: z.string().optional(),
  label: z.string().trim().min(1, "Link label is required"),
});

export const headerContentSchema = z.object({
  logoText: z.string().min(1, "Logo text is required"),
  subLogoText: z.string().min(1, "Sub logo text is required"),
  links: z.array(headerLinkSchema),
  button: z
    .object({
      href: z.string(),
      text: z.string(),
    })
    .optional(),
});

export type HeaderLink = z.infer<typeof headerLinkSchema>;
