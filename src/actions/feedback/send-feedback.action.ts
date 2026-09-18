"use server";

import type { z } from "zod";
import { logger } from "@/lib/logger/logger";
import { feedbackFormSchema } from "@/schemas/feedback-form.schema";
import { emailService } from "@/lib/email/email.service";

export interface SendFeedbackActionResult {
  success: boolean;
  error?: string;
  errors?: z.core.$ZodIssue[];
}

export async function sendFeedbackAction(data: unknown): Promise<SendFeedbackActionResult> {
  const result = feedbackFormSchema.safeParse(data);

  if (!result.success) {
    logger.warn(
      {
        errors: result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      "Feedback form validation failed",
    );

    return {
      success: false,
      error: "Validation failed",
      errors: result.error.issues,
    };
  }

  const sendResult = await emailService.sendFeedbackNotification(result.data);

  if (!sendResult.success) {
    logger.error({ error: sendResult.error }, "Failed to send feedback email");

    return {
      success: false,
      error: sendResult.error || "Failed to send email",
    };
  }

  logger.info(
    {
      email: result.data.email,
      subject: result.data.subject,
    },
    "Feedback form submitted and email sent successfully",
  );

  return { success: true };
}
