import { z } from "zod";

export type Contract1824Schema = z.infer<typeof contract1824Schema>;

const REQUIRED_ERROR = z.string().min(1, "Обов'язкове поле");

export const contract1824Schema = z.object({
  title: REQUIRED_ERROR,
  subtitle: REQUIRED_ERROR,
  buttonTitle: REQUIRED_ERROR,
  content: z.array(
    z.object({
      title: REQUIRED_ERROR,
      subtitle: REQUIRED_ERROR,
    }),
  ),
  contact: z.object({
    startText: REQUIRED_ERROR,
    number: REQUIRED_ERROR,
    endText: REQUIRED_ERROR,
  }),
  imgContent: z.object({
    title: REQUIRED_ERROR,
    subtitle: REQUIRED_ERROR,
    backgroundImage: z
      .object({
        publicId: z.string().optional(),
        secureUrl: z.string().url("Некоректний URL"),
      })
      .nullable()
      .optional(),
  }),
});
