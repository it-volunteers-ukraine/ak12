import { z } from "zod";

export type HeroSchema = z.infer<typeof HeroSchema>;

export const HeroSchema = z.object({
    title: z.string().min(1, "Заголовок обов'язковий"),
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
