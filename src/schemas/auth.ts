import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Field is mandatory")
    .max(50, "Maximum length is 50 characters")
    .email("Must be in email format (example@domain.com)"),
  password: z
    .string()
    .min(1, "Field is mandatory")
    .min(12, "Minimum length is 12 characters")
    .max(64, "Maximum length is 64 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[!@#$%^&*()_+\-=\[\]{}|\\:;"'<>,.?/]/, "Must contain at least one special character"),
});