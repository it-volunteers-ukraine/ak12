import { z } from "zod";

export type HeroSchema = z.infer<typeof heroContentSchema>;

export const heroContentSchema = z.object({
  title: z.string().min(1, "Обов'язкове поле"),
  subtitle: z.string().min(1, "Обов'язкове поле"),
  backgroundImage: z.object({
    publicId: z.string().optional(),
    secureUrl: z.string().url("Повинно бути валидным URL").min(1, "Обов'язкове поле"),
  }),
  buttonTitle: z.string().min(1, "Обов'язкове поле"),
  hiringChance: z.string().min(1, "Обov'язкове поле"),
  majors: z.string().min(1, "Обov'язкове поле"),
  support: z.string().min(1, "Обов'язкове поле"),
});
