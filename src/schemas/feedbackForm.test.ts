import { getFeedbackFormSchema } from "./feedbackForm";

const error = (key: string, params?: Record<string, unknown>) =>
  params ? `${key}:${JSON.stringify(params)}` : key;

const schema = getFeedbackFormSchema(error);

const validInput = {
  firstName: "Іван",
  lastName: "Петренко",
  phone: "+380501234567",
  email: "ivan@example.com",
  description: "Хочу долучитися до підрозділу — це достатньо довгий опис.",
  subject: "general",
};

describe("getFeedbackFormSchema", () => {
  it("should accept a fully populated valid payload", () => {
    const result = schema.safeParse(validInput);

    expect(result.success).toBe(true);
  });

  it("should transform a valid phone to E.164 format", () => {
    const result = schema.safeParse(validInput);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("+380501234567");
    }
  });

  it("should accept a different valid international phone number", () => {
    const result = schema.safeParse({ ...validInput, phone: "+14155552671" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("+14155552671");
    }
  });
});
