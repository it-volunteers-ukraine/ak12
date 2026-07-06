import { redirect } from "next/navigation";
import { createSession, validateAdmin, validateTwoFactor } from "@/lib/auth/session.service";
import { adminLogin, verifyTwoFactor } from "@/actions/auth/login.action";

jest.mock("@/lib/auth/session.service", () => ({
  createSession: jest.fn(),
  validateAdmin: jest.fn(),
  validateTwoFactor: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

const makeFormData = (entries: Record<string, string>) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(entries)) {
    formData.append(key, value);
  }

  return formData;
};

const initialState = {
  fieldErrors: {},
  error: "",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("adminLogin", () => {
  it("should request two factor verification on valid credentials", async () => {
    (validateAdmin as jest.Mock).mockResolvedValue(true);

    const formData = makeFormData({
      email: "admin@example.com",
      password: "Strong-Pass-1234",
      locale: "uk",
    });

    const result = await adminLogin(initialState, formData);

    expect(validateAdmin).toHaveBeenCalledWith("admin@example.com", "Strong-Pass-1234");

    expect(result).toEqual({
      fieldErrors: {},
      error: "",
      needsTwoFactor: true,
      locale: "uk",
    });

    expect(createSession).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should default to the uk locale when no locale field is provided", async () => {
    (validateAdmin as jest.Mock).mockResolvedValue(true);

    const formData = makeFormData({
      email: "admin@example.com",
      password: "Strong-Pass-1234",
    });

    const result = await adminLogin(initialState, formData);

    expect(result.locale).toBe("uk");
    expect(result.needsTwoFactor).toBe(true);

    expect(createSession).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should honour an explicit en locale", async () => {
    (validateAdmin as jest.Mock).mockResolvedValue(true);

    const formData = makeFormData({
      email: "admin@example.com",
      password: "Strong-Pass-1234",
      locale: "en",
    });

    const result = await adminLogin(initialState, formData);

    expect(result.locale).toBe("en");
    expect(result.needsTwoFactor).toBe(true);

    expect(createSession).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should return field errors and skip auth when the input fails schema validation", async () => {
    const formData = makeFormData({
      email: "not-an-email",
      password: "short",
      locale: "uk",
    });

    const result = await adminLogin(initialState, formData);

    expect(result.error).toBe("");
    expect(result.fieldErrors.email?.length ?? 0).toBeGreaterThan(0);
    expect(result.fieldErrors.password?.length ?? 0).toBeGreaterThan(0);

    expect(validateAdmin).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should return a password field error when validateAdmin rejects the credentials", async () => {
    (validateAdmin as jest.Mock).mockResolvedValue(false);

    const formData = makeFormData({
      email: "admin@example.com",
      password: "Strong-Pass-1234",
      locale: "uk",
    });

    const result = await adminLogin(initialState, formData);

    expect(result.fieldErrors.password).toEqual(["Невірний email або пароль"]);

    expect(createSession).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should return empty password errors when only email is invalid", async () => {
    const formData = makeFormData({
      email: "invalid-email",
      password: "Strong-Pass-1234",
    });

    const result = await adminLogin(initialState, formData);

    expect(result.fieldErrors.email?.length).toBeGreaterThan(0);
    expect(result.fieldErrors.password).toEqual([]);

    expect(validateAdmin).not.toHaveBeenCalled();
  });

  it("should return empty email errors when only password is invalid", async () => {
    const formData = makeFormData({
      email: "admin@example.com",
      password: "",
    });

    const result = await adminLogin(initialState, formData);

    expect(result.fieldErrors.email).toEqual([]);
    expect(result.fieldErrors.password?.length).toBeGreaterThan(0);

    expect(validateAdmin).not.toHaveBeenCalled();
  });
});

describe("verifyTwoFactor", () => {
  it("should create session and redirect on valid code", async () => {
    (validateTwoFactor as jest.Mock).mockReturnValue(true);

    const formData = makeFormData({
      code: "123456",
      locale: "uk",
    });

    await expect(verifyTwoFactor(initialState, formData)).rejects.toThrow("NEXT_REDIRECT");

    expect(validateTwoFactor).toHaveBeenCalledWith("123456");
    expect(createSession).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/uk/admin");
  });

  it("should return validation error for invalid code format", async () => {
    const formData = makeFormData({
      code: "123",
      locale: "uk",
    });

    const result = await verifyTwoFactor(initialState, formData);

    expect(result).toEqual({
      fieldErrors: {
        code: ["Введіть 6-значний код"],
      },
      error: "",
      needsTwoFactor: true,
      locale: "uk",
    });

    expect(validateTwoFactor).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should return validation error when two factor code is incorrect", async () => {
    (validateTwoFactor as jest.Mock).mockReturnValue(false);

    const formData = makeFormData({
      code: "123456",
      locale: "uk",
    });

    const result = await verifyTwoFactor(initialState, formData);

    expect(validateTwoFactor).toHaveBeenCalledWith("123456");

    expect(result).toEqual({
      fieldErrors: {
        code: ["Невірний код"],
      },
      error: "",
      needsTwoFactor: true,
      locale: "uk",
    });

    expect(createSession).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should honour en locale on redirect", async () => {
    (validateTwoFactor as jest.Mock).mockReturnValue(true);

    const formData = makeFormData({
      code: "123456",
      locale: "en",
    });

    await expect(verifyTwoFactor(initialState, formData)).rejects.toThrow("NEXT_REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/en/admin");
  });

  it("should default to uk locale when locale is missing and code is invalid", async () => {
    const formData = makeFormData({
      code: "123",
    });

    const result = await verifyTwoFactor(initialState, formData);

    expect(result).toEqual({
      fieldErrors: {
        code: ["Введіть 6-значний код"],
      },
      error: "",
      needsTwoFactor: true,
      locale: "uk",
    });
  });
});
