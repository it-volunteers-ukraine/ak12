import { z } from "zod";

export type LifeOfUnitData = z.infer<typeof aboutUsSchema>;

const aboutUsItemSchema = z.object({
  text: z.string().min(1, "Назва обов'язкова"),
  image: z.string().optional().or(z.literal("")),
});

export const aboutUsSchema = z.object({
  mainTitle: z.string().min(1, "Заголовок секції обов'язковий"),
  description: z.string().min(1, "Заголовок секції обов'язковий"),
  content: z.object({
    title: z.string().min(1, "Заголовок секції обов'язковий"),
    gallery: z.array(aboutUsItemSchema).min(1, "Додайте хоча б один елемент"),
  }),
});
