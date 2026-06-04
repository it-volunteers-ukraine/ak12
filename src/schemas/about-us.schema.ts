import { z } from "zod";

export type LifeOfUnitData = z.infer<typeof aboutUsSchema>;

const isValidYouTubeUrl = (url: string) =>
  /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);

const aboutUsItemSchema = z
  .object({
    text: z.string().min(1, "Назва обов'язкова"),
    mediaType: z.enum(["image", "video"]).optional(),
    secureUrl: z.string().optional().or(z.literal("")),
    publicId: z.string().optional(),
    videoUrl: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((url) => !url || url === "" || isValidYouTubeUrl(url), {
        message: "Некоректне YouTube посилання. Використовуйте формат youtube.com або youtu.be",
      }),
  })
  .nullable()
  .optional();

export const aboutUsSchema = z.object({
  mainTitle: z.string().min(1, "Заголовок секції обов'язковий"),
  description: z.string().min(1, "Заголовок секції обов'язковий"),
  content: z.object({
    gallery: z.array(aboutUsItemSchema).min(1, "Додайте хоча б один елемент"),
  }),
});