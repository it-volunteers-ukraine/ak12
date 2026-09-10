import type { IFeedbackForm } from "@/schemas";

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  secure?: boolean;
  from?: string;
  to?: string;
}

export interface SendMailOptions {
  to?: string;
  from?: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export interface SendMailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export type FeedbackEmailPayload = IFeedbackForm;
