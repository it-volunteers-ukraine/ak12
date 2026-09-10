import nodemailer, { type Transporter } from "nodemailer";
import { serverEnv } from "@/lib/env/server";
import { logger } from "@/lib/logger/logger";
import type { FeedbackEmailPayload, SendMailOptions, SendMailResult, SmtpConfig } from "./types";

export function getSmtpConfig(): SmtpConfig {
  const host = serverEnv.smtp.host || "";
  const rawPort = serverEnv.smtp.port;
  const port = rawPort ? Number.parseInt(rawPort, 10) : 587;
  const user = serverEnv.smtp.user || "";
  const password = serverEnv.smtp.password;
  const rawSecure = serverEnv.smtp.secure;
  const secure = rawSecure !== undefined ? rawSecure === "true" : port === 465;
  const to = serverEnv.smtp.to || serverEnv.auth.adminEmail || user || "";

  return {
    host,
    port,
    user,
    password,
    secure,
    to,
  };
}

export function createTransporter(configOverride?: Partial<SmtpConfig>): Transporter {
  const config = { ...getSmtpConfig(), ...configOverride };

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth:
      config.user && config.password
        ? {
            user: config.user,
            pass: config.password,
          }
        : undefined,
  });
}

export async function sendMail(
  options: SendMailOptions,
  configOverride?: Partial<SmtpConfig>,
): Promise<SendMailResult> {
  const config = { ...getSmtpConfig(), ...configOverride };

  if (!config.host || !config.port || !config.user) {
    const errorMsg = "SMTP configuration is incomplete (missing host, port, or user)";

    logger.error(
      {
        host: !!config.host,
        port: !!config.port,
        user: !!config.user,
      },
      errorMsg,
    );

    return { success: false, error: errorMsg };
  }

  const to = options.to || config.to;

  if (!to) {
    const errorMsg = "No recipient email address specified";

    logger.error(errorMsg);

    return { success: false, error: errorMsg };
  }

  const from = options.from || config.from || config.user;

  try {
    const transporter = createTransporter(config);
    const info = await transporter.sendMail({
      from,
      to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
    });

    logger.info({ messageId: info.messageId, to, subject: options.subject }, "Email sent successfully");

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error while sending email";

    logger.error({ error, to, subject: options.subject }, "Failed to send email");

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function sendFeedbackNotification(
  feedback: FeedbackEmailPayload,
  configOverride?: Partial<SmtpConfig>,
): Promise<SendMailResult> {
  const subject = `Нове звернення: ${feedback.subject} (${feedback.firstName} ${feedback.lastName})`;
  const senderName = `${feedback.firstName} ${feedback.lastName}`.trim();
  const from = senderName ? `"${senderName}" <${feedback.email}>` : feedback.email;

  const text = `Нове повідомлення із форми зворотного зв'язку:

Ім'я: ${feedback.firstName} ${feedback.lastName}
Email: ${feedback.email}
Телефон: ${feedback.phone}
Тема: ${feedback.subject}

Повідомлення:
${feedback.description}
`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #222; border-bottom: 2px solid #eab308; padding-bottom: 8px;">Нове звернення з форми зворотного зв'язку</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #555;">Ім'я та прізвище:</td>
          <td style="padding: 8px 0; color: #111;">${feedback.firstName} ${feedback.lastName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
          <td style="padding: 8px 0; color: #111;"><a href="mailto:${feedback.email}">${feedback.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">Телефон:</td>
          <td style="padding: 8px 0; color: #111;"><a href="tel:${feedback.phone}">${feedback.phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">Тема:</td>
          <td style="padding: 8px 0; color: #111;">${feedback.subject}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; padding: 16px; background-color: #f9f9f9; border-left: 4px solid #eab308; border-radius: 4px;">
        <p style="margin: 0 0 8px 0; font-weight: bold; color: #333;">Повідомлення:</p>
        <p style="margin: 0; white-space: pre-wrap; color: #222;">${feedback.description}</p>
      </div>
      <p style="margin-top: 24px; font-size: 12px; color: #888;">
        Лист надіслано автоматично сервісом AK12. Для відповіді відправнику скористайтеся кнопкою &quot;Відповісти&quot; у вашому поштовому клієнті.
      </p>
    </div>
  `;

  return sendMail(
    {
      from,
      subject,
      text,
      html,
      replyTo: feedback.email,
    },
    configOverride,
  );
}

export const emailService = {
  getSmtpConfig,
  createTransporter,
  sendMail,
  sendFeedbackNotification,
};
