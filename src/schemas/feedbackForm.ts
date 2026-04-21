import { z } from "zod";
import { TranslationValues } from "next-intl";
import { parsePhoneNumberFromString } from "libphonenumber-js";

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
    phone: z
      .string()
      .min(1, error("required"))
      .refine((value) => {
        const phoneNumber = parsePhoneNumberFromString(value);

        return phoneNumber ? phoneNumber.isValid() : false;
      }, error("phone"))
      .transform((value) => {
        const phoneNumber = parsePhoneNumberFromString(value);

        return phoneNumber!.number;
      }),
    email: z.email(error("email")),
    description: z
      .string(error("required"))
      .min(10, error("minLength", { min: 10 }))
      .max(500, error("maxLength", { max: 500 })),
    subject: z.string(error("required")).min(1, error("required")),
  });
};

export type IFeedbackForm = z.infer<ReturnType<typeof getFeedbackFormSchema>>;
export type TFeedbackFormInput = z.input<ReturnType<typeof getFeedbackFormSchema>>;
export type TFeedbackFormOutput = z.output<ReturnType<typeof getFeedbackFormSchema>>;
