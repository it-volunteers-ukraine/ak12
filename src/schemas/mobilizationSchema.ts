import { z } from "zod";

export type MobilizationSchema = z.infer<typeof mobilizationSchema>;

export const mobilizationSchema = z.object({
  title: z.string().min(1, "A title is required"),
  subtitle: z.string().optional(),
  eyebrow: z.string().optional(),
  primaryButton: z
    .object({
      text: z.string(),
      link: z.string(),
    })
    .optional(),
});
