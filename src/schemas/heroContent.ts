import { z } from "zod";

export type HeroSchema = z.infer<typeof heroContentSchema>;

const REQUIRED_ERROR = "Обов'язкове поле";

export const heroContentSchema = z.object({
  title: z.string().min(1, REQUIRED_ERROR),
  subtitle: z.string().min(1, REQUIRED_ERROR),
  buttonTitle: z.string().min(1, REQUIRED_ERROR),
  hiringChance: z.object({
    title: z.string().min(1, REQUIRED_ERROR),
    value: z.string().min(1, REQUIRED_ERROR),
  }),
  majors: z.object({
    title: z.string().min(1, REQUIRED_ERROR),
    value: z.string().min(1, REQUIRED_ERROR),
  }),
  support: z.object({
    title: z.string().min(1, REQUIRED_ERROR),
    value: z.string().min(1, REQUIRED_ERROR),
  }),
  backgroundImage: z
    .object({
      publicId: z.string().optional(),
      secureUrl: z.string().url(),
    })
    .nullable()
    .optional(),
});
