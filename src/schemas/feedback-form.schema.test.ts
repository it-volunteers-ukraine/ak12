import { getFeedbackFormSchema } from "@/schemas/feedback-form.schema";

const error = (key: string, params?: Record<string, unknown>) => (params ? `${key}:${JSON.stringify(params)}` : key);

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
    const result = schema.safeParse({
      ...validInput,
      phone: "+14155552671",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.phone).toBe("+14155552671");
    }
  });

  it("should reject firstName shorter than 2 characters", () => {
    const result = schema.safeParse({
      ...validInput,
      firstName: "І",
    });

    expect(result.success).toBe(false);
  });

  it("should reject lastName longer than 100 characters", () => {
    const result = schema.safeParse({
      ...validInput,
      lastName: "a".repeat(101),
    });

    expect(result.success).toBe(false);
  });

  it("should reject an empty phone", () => {
    const result = schema.safeParse({
      ...validInput,
      phone: "",
    });

    expect(result.success).toBe(false);
  });

  it("should reject an invalid phone number", () => {
    const result = schema.safeParse({
      ...validInput,
      phone: "12345",
    });

    expect(result.success).toBe(false);
  });

  it("should reject an invalid email", () => {
    const result = schema.safeParse({
      ...validInput,
      email: "invalid-email",
    });

    expect(result.success).toBe(false);
  });

  it("should reject description shorter than 10 characters", () => {
    const result = schema.safeParse({
      ...validInput,
      description: "short",
    });

    expect(result.success).toBe(false);
  });

  it("should reject description longer than 500 characters", () => {
    const result = schema.safeParse({
      ...validInput,
      description: "a".repeat(501),
    });

    expect(result.success).toBe(false);
  });

  it("should reject an empty subject", () => {
    const result = schema.safeParse({
      ...validInput,
      subject: "",
    });

    expect(result.success).toBe(false);
  });
});
