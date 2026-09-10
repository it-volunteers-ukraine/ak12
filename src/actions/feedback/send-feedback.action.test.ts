import { sendFeedbackAction } from "./send-feedback.action";
import { emailService } from "@/lib/email/email.service";

jest.mock("@/lib/email/email.service", () => ({
  emailService: {
    sendFeedbackNotification: jest.fn(),
  },
}));

const MOCK_VALID_FEEDBACK_DATA = {
  firstName: "Олександр",
  lastName: "Коваленко",
  email: "oleksandr@example.com",
  phone: "+380501234567",
  subject: "Переведення",
  description: "Прошу розглянути можливість переведення до вашого підрозділу.",
};

const INVALID_FEEDBACK_PAYLOADS = [
  {
    description: "empty payload",
    payload: {},
  },
  {
    description: "firstName too short and invalid email",
    payload: {
      firstName: "A",
      lastName: "Коваленко",
      email: "not-an-email",
      phone: "+380501234567",
      subject: "Переведення",
      description: "Прошу розглянути можливість переведення до вашого підрозділу.",
    },
  },
  {
    description: "invalid phone format and description too short",
    payload: {
      firstName: "Олександр",
      lastName: "Коваленко",
      email: "oleksandr@example.com",
      phone: "123",
      subject: "Переведення",
      description: "short",
    },
  },
];

const EMAIL_SERVICE_FAILURE_CASES = [
  {
    errorReason: "SMTP server unreachable",
    serviceResponse: { success: false, error: "SMTP server unreachable" },
    expectedError: "SMTP server unreachable",
  },
  {
    errorReason: "unspecified service error fallback",
    serviceResponse: { success: false },
    expectedError: "Failed to send email",
  },
];

describe("sendFeedbackAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validation failures", () => {
    it.each(INVALID_FEEDBACK_PAYLOADS)(
      "should fail validation for $description",
      async ({ payload }) => {
        const result = await sendFeedbackAction(payload);

        expect(result.success).toBe(false);
        expect(result.error).toBe("Validation failed");
        expect(result.errors).toBeDefined();
        expect(emailService.sendFeedbackNotification).not.toHaveBeenCalled();
      },
    );
  });

  it("should successfully send feedback when data is valid", async () => {
    (emailService.sendFeedbackNotification as jest.Mock).mockResolvedValueOnce({
      success: true,
      messageId: "<msg-123@example.com>",
    });

    const result = await sendFeedbackAction(MOCK_VALID_FEEDBACK_DATA);

    expect(result.success).toBe(true);
    expect(emailService.sendFeedbackNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: MOCK_VALID_FEEDBACK_DATA.firstName,
        lastName: MOCK_VALID_FEEDBACK_DATA.lastName,
        email: MOCK_VALID_FEEDBACK_DATA.email,
        phone: MOCK_VALID_FEEDBACK_DATA.phone,
        subject: MOCK_VALID_FEEDBACK_DATA.subject,
        description: MOCK_VALID_FEEDBACK_DATA.description,
      }),
    );
  });

  describe("email service failure handling", () => {
    it.each(EMAIL_SERVICE_FAILURE_CASES)(
      "should return failure when $errorReason",
      async ({ serviceResponse, expectedError }) => {
        (emailService.sendFeedbackNotification as jest.Mock).mockResolvedValueOnce(serviceResponse);

        const result = await sendFeedbackAction(MOCK_VALID_FEEDBACK_DATA);

        expect(result.success).toBe(false);
        expect(result.error).toBe(expectedError);
      },
    );
  });
});
