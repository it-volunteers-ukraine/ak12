import { z } from "zod";

export const headerLinkSchema = z.object({
  href: z.string().min(0, "Href is required"),
  id: z.string().min(1, "Link ID is required"),
  label: z.string().min(0, "Link label is required"),
});

export const headerContentSchema = z.object({
  logoText: z.string().min(1, "Logo text is required"),
  links: z.array(headerLinkSchema),
  cta: headerLinkSchema.optional(),
});

export type HeaderLink = z.infer<typeof headerLinkSchema>;
