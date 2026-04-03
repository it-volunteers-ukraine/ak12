import { z } from "zod";

const lifeOfUnitItemSchema = z.object({
  title: z.string().min(1, "Назва обов'язкова"),
  image: z.string().min(1, "Фото обов'язкове"),
  alt: z.string().optional(),
});

export const lifeOfUnitSchema = z.object({
  mainTitle: z.string().min(1, "Заголовок секції обов'язковий"),
  
  items: z.array(lifeOfUnitItemSchema).min(1, "Додайте хоча б один елемент"),
});

export type LifeOfUnitData = z.infer<typeof lifeOfUnitSchema>;