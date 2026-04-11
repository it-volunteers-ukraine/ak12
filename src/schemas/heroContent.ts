import { z } from "zod";

export const heroContentSchema = z.object({
  title: z.string().min(1, "Обов'язкове поле"),
  subtitle: z.string().min(1, "Обов'язкове поле"),
  eyebrow: z.string().optional(),

  backgroundImage: z
    .object({
      publicId: z.string(),
      secureUrl: z.string().url(),
    })
    .nullable()
    .optional(),

  primaryButton: z
    .object({
      text: z.string().min(1, "Обов'язкове поле"),
      link: z.string(),
    })
    .optional(),
});

export type HeroSchema = z.infer<typeof heroContentSchema>;
