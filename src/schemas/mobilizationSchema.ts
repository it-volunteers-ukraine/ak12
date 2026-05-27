import { z } from "zod";

export type MobilizationSchema = z.infer<typeof mobilizationSchema>;

const requiredString = (message = "Обов'язкове поле") => z.string().trim().min(1, message);

const cardSchema = z.object({
  title: requiredString(),
  subtitle: requiredString(),
  primaryDescription: requiredString(),
  secondaryDescription: z.string().trim().optional(),
  buttonText: z.string().trim().optional(),
});

export const mobilizationSchema = z.object({
  title: requiredString(),
  subtitle: requiredString(),
  menuButton: requiredString(),
  cards: z.array(cardSchema),
  primaryDescription: requiredString(),
  accentedDescription: requiredString(),
  secondaryDescription: requiredString(),
});
