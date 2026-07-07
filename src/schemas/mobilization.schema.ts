import { z } from "zod";

export type MobilizationSchema = z.infer<typeof mobilizationSchema>;

const requiredString = (message = "Обов'язкове поле") => z.string().trim().min(1, message);

export const baseSectionSchema = z.object({
  sectionTitle: requiredString(),
  sectionSubtitle: requiredString(),
  menuButton: requiredString(),
  buttonJoinUs: requiredString(),
  message: requiredString(),
});

const cardSchema = z.object({
  title: requiredString(),
  subtitle: requiredString(),
  primaryDescription: requiredString(),
  secondaryDescription: z.string().trim().optional(),
});

export const mobilizationSchema = z.object({
  baseSection: baseSectionSchema,
  cards: z.array(cardSchema),
  primaryDescription: requiredString(),
  accentedDescription: requiredString(),
  secondaryDescription: requiredString(),
});

export type MobilizationContent = z.infer<typeof mobilizationSchema>;
export type MobilizationCardContent = z.infer<typeof cardSchema>;
