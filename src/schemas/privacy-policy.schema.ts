import { z } from "zod";

export type PrivacyPolicyContent = z.infer<typeof privacyPolicySchema>;

export const privacyPolicySchema = z.object({
  title: z.string().min(1, "Заголовок є обов'язковим"),
  description: z.string().min(1, "Опис є обов'язковим"),
});
