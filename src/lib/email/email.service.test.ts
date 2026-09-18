import nodemailer from "nodemailer";
import { emailService, getSmtpConfig, createTransporter, sendMail, sendFeedbackNotification } from "./email.service";
import type { FeedbackEmailPayload, SendMailOptions, SmtpConfig } from "./types";

jest.mock("nodemailer");

const MOCK_SMTP_CONFIG: SmtpConfig = {
  host: "smtp.example.com",
  port: 587,
  user: "user@example.com",
  password: "secretpassword",
  secure: false,
  to: "admin@example.com",
};

const MOCK_FEEDBACK_PAYLOAD: FeedbackEmailPayload = {
  firstName: "Тарас",
  lastName: "Шевченко",
  email: "taras@example.com",
  phone: "+380501234567",
  subject: "Долучитися",
  description: "Хочу приєднатися до підрозділу оператором БПЛА",
};

const MOCK_MAIL_OPTIONS: SendMailOptions = {
  to: "admin@example.com",
  from: "noreply@example.com",
  subject: "Test Subject",
  text: "Test body",
  html: "<p>Test body</p>",
  replyTo: "user@example.com",
};

const TRANSPORTER_CONFIG_CASES: Array<{
  description: string;
  config: SmtpConfig;
  expectedAuth: { user: string; pass: string } | undefined;
}> = [
  {
    description: "config with password credentials",
    config: {
      host: "smtp.test.com",
      port: 465,
      user: "test@test.com",
      password: "secretpassword",
      secure: true,
    },
    expectedAuth: {
      user: "test@test.com",
      pass: "secretpassword",
    },
  },
  {
    description: "config without password",
    config: {
      host: "smtp.test.com",
      port: 587,
      user: "test@test.com",
      secure: false,
    },
    expectedAuth: undefined,
  },
];

const INVALID_SEND_MAIL_CASES: Array<{
  description: string;
  options: SendMailOptions;
  config: Partial<SmtpConfig>;
  expectedErrorMessage: string;
}> = [
  {
    description: "missing host, port, or user in SMTP config",
    options: { to: "recipient@example.com", subject: "Test", text: "Hello" },
    config: { host: "", port: 0, user: "" },
    expectedErrorMessage: "SMTP configuration is incomplete",
  },
  {
    description: "missing recipient email address",
    options: { to: "", subject: "Test", text: "Hello" },
    config: { host: "smtp.example.com", port: 587, user: "user@example.com", to: "" },
    expectedErrorMessage: "No recipient email address specified",
  },
];

describe("email.service", () => {
  const mockSendMail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail,
    });
  });

  describe("getSmtpConfig", () => {
    it("should return config based on serverEnv", () => {
      const config = getSmtpConfig();

      expect(config).toBeDefined();
      expect(typeof config.port).toBe("number");
    });
  });

  describe("createTransporter", () => {
    it.each(TRANSPORTER_CONFIG_CASES)(
      "should configure transporter properly for $description",
      ({ config, expectedAuth }) => {
        createTransporter(config);

        expect(nodemailer.createTransport).toHaveBeenCalledWith({
          host: config.host,
          port: config.port,
          secure: config.secure,
          auth: expectedAuth,
        });
      },
    );
  });

  describe("sendMail", () => {
    it.each(INVALID_SEND_MAIL_CASES)(
      "should fail when $description",
      async ({ options, config, expectedErrorMessage }) => {
        const result = await sendMail(options, config);

        expect(result.success).toBe(false);
        expect(result.error).toContain(expectedErrorMessage);
        expect(mockSendMail).not.toHaveBeenCalled();
      },
    );

    it("should successfully send an email", async () => {
      mockSendMail.mockResolvedValueOnce({
        messageId: "<test-id-123@example.com>",
      });

      const result = await sendMail(MOCK_MAIL_OPTIONS, MOCK_SMTP_CONFIG);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("<test-id-123@example.com>");
      expect(mockSendMail).toHaveBeenCalledWith({
        from: MOCK_MAIL_OPTIONS.from,
        to: MOCK_MAIL_OPTIONS.to,
        subject: MOCK_MAIL_OPTIONS.subject,
        text: MOCK_MAIL_OPTIONS.text,
        html: MOCK_MAIL_OPTIONS.html,
        replyTo: MOCK_MAIL_OPTIONS.replyTo,
      });
    });

    it("should return failure when nodemailer fails", async () => {
      mockSendMail.mockRejectedValueOnce(new Error("Connection timeout"));

      const result = await sendMail(
        {
          to: "admin@example.com",
          subject: "Test Subject",
          text: "Test body",
        },
        MOCK_SMTP_CONFIG,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Connection timeout");
    });
  });

  describe("sendFeedbackNotification", () => {
    it("should build and send feedback email with all fields", async () => {
      mockSendMail.mockResolvedValueOnce({
        messageId: "<feedback-msg-id@example.com>",
      });

      const result = await sendFeedbackNotification(MOCK_FEEDBACK_PAYLOAD, {
        host: "smtp.example.com",
        port: 587,
        user: "mailer@example.com",
        to: "corps@example.com",
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("<feedback-msg-id@example.com>");
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "corps@example.com",
          replyTo: "taras@example.com",
          subject: expect.stringContaining("Тарас Шевченко"),
          text: expect.stringContaining("Тарас Шевченко"),
          html: expect.stringContaining("taras@example.com"),
        }),
      );
    });
  });

  describe("emailService object export", () => {
    it("should expose all functions", () => {
      expect(emailService.getSmtpConfig).toBe(getSmtpConfig);
      expect(emailService.createTransporter).toBe(createTransporter);
      expect(emailService.sendMail).toBe(sendMail);
      expect(emailService.sendFeedbackNotification).toBe(sendFeedbackNotification);
    });
  });
});
