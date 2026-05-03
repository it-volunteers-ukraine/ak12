import { z } from "zod";

export const headerLinkSchema = z.object({
  idSection: z.string().optional(),
  label: z.string().trim().min(1, "Назва пункту є обов'язковим"),
});

export const headerContentSchema = z.object({
  logoText: z.string().min(1, "Необхідно вказати текст логотипу"),
  subLogoText: z
    .string()
    .min(1, "Необхідно вказати скорочений текст логотипу")
    .max(10, "Скорочений текст не повинен бути дліншим за 10 символів"),
  links: z.array(headerLinkSchema),
  button: z
    .object({
      href: z.string(),
      text: z.string(),
    })
    .optional(),
  logoImg: z
    .object({
      publicId: z.string().optional(),
      secureUrl: z.string().url(),
    })
    .nullable()
    .optional(),
});

export const footerContentSchema = z.object({
  title: z.string().min(1, "Заголовок є обов’язковим"),
  description: z.string().min(1, "Опис є обов’язковим"),
  copyright: z.string().min(1, "Необхідно вказати авторські права"),
  copyrightOwner: z.string().min(1, "Необхідно вказати назву військової частини"),
  logoImg: z
    .object({
      publicId: z.string().optional(),
      secureUrl: z.string().url(),
    })
    .nullable()
    .optional(),
});

export const headerAndFooterContentSchema = z.object({
  header: headerContentSchema,
  footer: footerContentSchema,
});

export type HeaderLink = z.infer<typeof headerLinkSchema>;
export type FooterContent = z.infer<typeof footerContentSchema>;
export type HeaderContent = z.infer<typeof headerContentSchema>;
