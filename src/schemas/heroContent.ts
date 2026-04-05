import { z } from "zod";

export type HeroSchema = z.infer<typeof heroContentSchema>;

export const heroContentSchema = z.object({
  title: z.string().min(1, "Обов'язкове поле"),
  subtitle: z.string().min(1, "Обов'язкове поле"),
  eyebrow: z.string().optional(),

  backgroundImage: z.string().url().or(z.string().min(1, "Обов'язкове поле")),
  primaryButton: z
    .object({
      text: z.string().min(1, "Обов'язкове поле"),
      link: z.string(),
    })
    .optional(),
});
