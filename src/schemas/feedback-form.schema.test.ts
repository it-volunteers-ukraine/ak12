import { getFeedbackFormSchema } from "@/schemas/feedback-form.schema";

const mockErrorFormatter = (key: string, params?: Record<string, unknown>) =>
  params ? `${key}:${JSON.stringify(params)}` : key;

const schema = getFeedbackFormSchema(mockErrorFormatter);

const MOCK_VALID_FEEDBACK_FORM_INPUT = {
  firstName: "Іван",
  lastName: "Петренко",
  phone: "+380501234567",
  email: "ivan@example.com",
  description: "Хочу долучитися до підрозділу — це достатньо довгий опис.",
  subject: "general",
};

const VALID_PHONE_CASES = [
  { description: "Ukrainian mobile number", phone: "+380501234567", expected: "+380501234567" },
  { description: "international US number", phone: "+14155552671", expected: "+14155552671" },
];

const INVALID_FEEDBACK_CASES = [
  { field: "firstName", reason: "shorter than 2 characters", override: { firstName: "І" } },
  { field: "lastName", reason: "longer than 100 characters", override: { lastName: "a".repeat(101) } },
  { field: "phone", reason: "empty string", override: { phone: "" } },
  { field: "phone", reason: "invalid phone number format", override: { phone: "12345" } },
  { field: "email", reason: "invalid email format", override: { email: "invalid-email" } },
  { field: "description", reason: "shorter than 10 characters", override: { description: "short" } },
  { field: "description", reason: "longer than 500 characters", override: { description: "a".repeat(501) } },
  { field: "subject", reason: "empty string", override: { subject: "" } },
];

describe("getFeedbackFormSchema", () => {
  it("should accept a fully populated valid payload", () => {
    const result = schema.safeParse(MOCK_VALID_FEEDBACK_FORM_INPUT);

    expect(result.success).toBe(true);
  });

  describe("phone validation and transformation", () => {
    it.each(VALID_PHONE_CASES)(
      "should accept and transform $description ($phone) to $expected",
      ({ phone, expected }) => {
        const result = schema.safeParse({
          ...MOCK_VALID_FEEDBACK_FORM_INPUT,
          phone,
        });

        expect(result.success).toBe(true);

        if (result.success) {
          expect(result.data.phone).toBe(expected);
        }
      },
    );
  });

  describe("invalid field validation", () => {
    it.each(INVALID_FEEDBACK_CASES)(
      "should reject when $field is $reason",
      ({ override }) => {
        const result = schema.safeParse({
          ...MOCK_VALID_FEEDBACK_FORM_INPUT,
          ...override,
        });

        expect(result.success).toBe(false);
      },
    );
  });
});
