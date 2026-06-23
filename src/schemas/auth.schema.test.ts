import { loginSchema } from "@/schemas/auth.schema";

describe("loginSchema", () => {
  it("should accept a strong password matching all required character classes", () => {
    const result = loginSchema.safeParse({
      email: "admin@example.com",
      password: "Strong-Pass-1234",
    });

    expect(result.success).toBe(true);
  });

  it("should trim whitespace around the email", () => {
    const result = loginSchema.safeParse({
      email: "  admin@example.com  ",
      password: "Strong-Pass-1234",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("admin@example.com");
    }
  });

  it("should accept the minimum valid password length (12)", () => {
    const result = loginSchema.safeParse({
      email: "admin@example.com",
      password: "Aa1!aaaaaaaa",
    });

    expect(result.success).toBe(true);
  });
});
