import { z } from "zod";

export type LifeOfUnitData = z.infer<typeof aboutUsSchema>;

const aboutUsItemSchema = z
  .object({
    text: z.string().min(1, "Назва обов'язкова"),
    secureUrl: z.string().optional().or(z.literal("")),
    publicId: z.string().optional(),
  })
  .nullable()
  .optional();

export const aboutUsSchema = z.object({
  mainTitle: z.string().min(1, "Заголовок секції обов'язковий"),
  description: z.string().min(1, "Заголовок секції обов'язковий"),
  content: z.object({
    gallery: z.array(aboutUsItemSchema).min(1, "Додайте хоча б один елемент"),
  }),
    updatedAt: z.string().datetime().pipe(z.coerce.date()).optional(),

});
