import { z } from "zod";
import { TranslationValues } from "next-intl";

const PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

export const getFeedbackFormSchema = (error: (key: string, params?: TranslationValues) => string) => {
  return z.object({
    firstName: z
      .string(error("required"))
      .min(2, error("minLength", { min: 2 }))
      .max(100, error("maxLength", { max: 100 })),
    lastName: z
      .string(error("required"))
      .min(2, error("minLength", { min: 2 }))
      .max(100, error("maxLength", { max: 100 })),
    phone: z.string(error("required")).regex(PHONE_REGEX, error("phone")),
    email: z.email(error("email")),
    description: z
      .string(error("required"))
      .min(10, error("minLength", { min: 10 }))
      .max(500, error("maxLength", { max: 500 })),
    subject: z.string(error("required")).min(1, error("required")),
  });
};

export type IFeedbackForm = z.infer<ReturnType<typeof getFeedbackFormSchema>>;
