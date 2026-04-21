import { z } from "zod";

export type HeroSchema = z.infer<typeof heroContentSchema>;

const REQUIRED_STRING = z.string().trim().min(1, "Обов'язкове поле");

export const heroContentSchema = z.object({
  title: REQUIRED_STRING,
  subtitle: REQUIRED_STRING,
  buttonTitle: REQUIRED_STRING,
  hiringChance: z.object({
    title: REQUIRED_STRING,
    value: REQUIRED_STRING,
  }),
  majors: z.object({
    title: REQUIRED_STRING,
    value: REQUIRED_STRING,
  }),
  support: z.object({
    title: REQUIRED_STRING,
    value: REQUIRED_STRING,
  }),
  backgroundImage: z
    .object({
      publicId: z.string().optional(),
      secureUrl: z.string().url(),
    })
    .nullable()
    .optional(),
});
