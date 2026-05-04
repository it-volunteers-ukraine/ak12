import { ContactsType, SocialPlatform } from "@/constants";
import { z } from "zod";

export const infoSchema = z.object({
  type: z.enum(ContactsType, { message: "Оберіть тип контакту" }),
  href: z.string().min(1, "Контакт є обов'язковим"),
  label: z.string().min(1, "Заголовок контакту є обов'язковим"),
  textHref: z.string().min(1, "Текст посилання є обов'язковим"),
});

export const socialLinkSchema = z.object({
  platform: z.enum(SocialPlatform, { message: "Оберіть соціальну мережу" }),
  href: z.string().min(1, "Посилання є обов'язковим"),
});

const formSchema = z.object({
  title: z.string().min(1, "Обов'язкове поле"),
  modalTitle: z.string().min(1, "Обов'язкове поле"),
  descriptionInputTitle: z.string().min(1, "Обов'язкове поле"),
  descriptionInputPlaceholder: z.string().min(1, "Обов'язкове поле"),
  radioButtonsTitle: z.string().min(1, "Обов'язкове поле"),
  radioButtons: z.array(
    z.object({
      label: z.string().min(1, "Обов'язкове поле"),
    }),
  ),
  buttonSubmit: z.string().min(1, "Обов'язкове поле"),
  privacyPolicyTitle: z.string().min(1, "Обов'язкове поле"),
  privacyPolicyTextLink: z.string().min(1, "Обов'язкове поле"),
});

const contactsSchema = z.object({
  socialLinks: z.array(socialLinkSchema).optional(),
  info: z.array(infoSchema).optional(),
});

export const feedbackContentSchema = z.object({
  contacts: contactsSchema.optional(),
  form: formSchema.optional(),
  directContactTitle: z.string().min(1, "Обов'язкове поле"),
  responseTimeTitle: z.string().min(1, "Обов'язкове поле"),
  responseTimeDescription: z.string().min(1, "Обов'язкове поле"),
  socialMediaTitle: z.string().min(1, "Обов'язкове поле"),
});

export type ContactsInfo = z.infer<typeof infoSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type ContactsSchema = z.infer<typeof contactsSchema>;
export type FeedbackFormContent = z.infer<typeof formSchema>;
