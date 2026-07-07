import { z } from "zod";
import { baseSectionSchema } from "@/schemas/mobilization.schema";

export type TransferSchema = z.infer<typeof transferSchema>;

const REQUIRED_STRING = z.string().trim().min(1, "Обов'язкове поле");

export const transferSchema = z.object({
  baseSection: baseSectionSchema,
  title: REQUIRED_STRING,
  subtitle: REQUIRED_STRING,
  content: z
    .array(
      z.object({
        title: REQUIRED_STRING,
        subtitle: REQUIRED_STRING,
      }),
    )
    .min(1, "Додайте хоча б один елемент контенту"),
  transferLink: z.object({
    startText: REQUIRED_STRING,
    link: REQUIRED_STRING,
    endText: REQUIRED_STRING,
  }),
  backgroundImage: z
    .object({
      publicId: z.string().optional(),
      secureUrl: z.string().url("Некоректне посилання"),
    })
    .nullable()
    .optional(),
});

export type TransferContent = z.infer<typeof transferSchema>;
