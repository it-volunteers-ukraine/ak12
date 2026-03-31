import { z } from "zod";

export type HeroSchema = z.infer<typeof heroContentSchema>;

export const heroContentSchema = z.object({
  title: z.string().min(1, "A title is required"),
  subtitle: z.string().optional(),
  eyebrow: z.string().optional(),

  backgroundImage: z.string().url().or(z.string()),
  primaryButton: z
    .object({
      text: z.string(),
      link: z.string(),
    })
    .optional(),
});
