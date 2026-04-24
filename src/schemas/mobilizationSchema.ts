import { z } from "zod";

export type MobilizationSchema = z.infer<typeof mobilizationSchema>;

const requiredString = (message = "Обов'язкове поле") => z.string().trim().min(1, message);

export const mobilizationSchema = z.object({
  title: requiredString(),
  subtitle: requiredString(),
  content: requiredString(),
  buttonTitle: requiredString(),
});
