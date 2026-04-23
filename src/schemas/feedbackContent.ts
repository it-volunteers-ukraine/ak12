import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Обов'язкове поле"),
  modalTitle: z.string().min(1, "Обов'язкове поле"),
  descriptionInputTitle: z.string().min(1, "Обов'язкове поле"),
  descriptionInputPlaceholder: z.string().min(1, "Обов'язкове поле"),
  radioButtonsTitle: z.string().min(1, "Обов'язкове поле"),
  radioButtons: z.array(
    z.object({
      label: z.string().min(1, "Обов'язкове поле"),
      value: z.string().min(1, "Обов'язкове поле"),
    }),
  ),
  buttonSubmit: z.string().min(1, "Обов'язкове поле"),
  privacyPolicyTitle: z.string().min(1, "Обов'язкове поле"),
  privacyPolicyTextLink: z.string().min(1, "Обов'язкове поле"),
});

export const feedbackContentSchema = z.object({
  form: formSchema,
  directContactTitle: z.string().min(1, "Обов'язкове поле"),
  responseTimeTitle: z.string().min(1, "Обов'язкове поле"),
  responseTimeDescription: z.string().min(1, "Обов'язкове поле"),
  socialMediaTitle: z.string().min(1, "Обов'язкове поле"),
});

export type FeedbackFormContent = z.infer<typeof formSchema>;
