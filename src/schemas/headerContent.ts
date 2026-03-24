import { z } from "zod";

export const headerLinkSchema = z.object({
  id: z.string().optional(),
  href: z.string().trim().min(1, "Href is required"),
  label: z.string().trim().min(1, "Link label is required"),
});

export const headerContentSchema = z.object({
  logoText: z.string().min(1, "Logo text is required"),
  links: z.array(headerLinkSchema),
  cta: headerLinkSchema.optional(),
});

export type HeaderLink = z.infer<typeof headerLinkSchema>;
