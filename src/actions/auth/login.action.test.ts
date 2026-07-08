import { redirect } from "next/navigation";
import {
  createSession,
  createPreAuthSession,
  deletePreAuthSession,
  verifyPreAuthSession,
  validateAdmin,
  validateTwoFactor,
} from "@/lib/auth/session.service";
import { adminLogin, verifyTwoFactor } from "@/actions/auth/login.action";

jest.mock("@/lib/auth/session.service", () => ({
  createSession: jest.fn(),
  createPreAuthSession: jest.fn(),
  deletePreAuthSession: jest.fn(),
  verifyPreAuthSession: jest.fn(),
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

  (createSession as jest.Mock).mockResolvedValue(undefined);
  (createPreAuthSession as jest.Mock).mockResolvedValue(undefined);
  (deletePreAuthSession as jest.Mock).mockResolvedValue(undefined);
  (verifyPreAuthSession as jest.Mock).mockResolvedValue(true);
  (validateAdmin as jest.Mock).mockResolvedValue(false);
  (validateTwoFactor as jest.Mock).mockReturnValue(false);
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

    expect(createPreAuthSession).toHaveBeenCalledTimes(1);
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

    expect(createPreAuthSession).toHaveBeenCalledTimes(1);
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

    expect(createPreAuthSession).toHaveBeenCalledTimes(1);
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

    expect(createPreAuthSession).not.toHaveBeenCalled();
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

  it("should throw when creating pre-auth session fails", async () => {
    (validateAdmin as jest.Mock).mockResolvedValue(true);

    (createPreAuthSession as jest.Mock).mockRejectedValue(new Error("Pre auth failed"));

    const formData = makeFormData({
      email: "admin@example.com",
      password: "Strong-Pass-1234",
    });

    await expect(adminLogin(initialState, formData)).rejects.toThrow("Pre auth failed");
  });
});

describe("verifyTwoFactor", () => {
  it("should delete pre-auth session, create session and redirect on valid code", async () => {
    (verifyPreAuthSession as jest.Mock).mockResolvedValue(true);
    (validateTwoFactor as jest.Mock).mockReturnValue(true);

    const formData = makeFormData({
      code: "123456",
      locale: "uk",
    });

    await expect(verifyTwoFactor(initialState, formData)).rejects.toThrow("NEXT_REDIRECT");

    expect(verifyPreAuthSession).toHaveBeenCalledTimes(1);
    expect(validateTwoFactor).toHaveBeenCalledWith("123456");

    expect(deletePreAuthSession).toHaveBeenCalledTimes(1);
    expect(createSession).toHaveBeenCalledTimes(1);

    expect(redirect).toHaveBeenCalledWith("/uk/management-console-12ak");
  });

  it("should throw when deleting pre-auth session fails", async () => {
    (validateTwoFactor as jest.Mock).mockReturnValue(true);
    (deletePreAuthSession as jest.Mock).mockRejectedValue(new Error("Delete failed"));

    const formData = makeFormData({
      code: "123456",
      locale: "uk",
    });

    await expect(verifyTwoFactor(initialState, formData)).rejects.toThrow("Delete failed");

    expect(deletePreAuthSession).toHaveBeenCalledTimes(1);
    expect(createSession).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should throw when creating session fails", async () => {
    (validateTwoFactor as jest.Mock).mockReturnValue(true);
    (createSession as jest.Mock).mockRejectedValue(new Error("Create failed"));

    const formData = makeFormData({
      code: "123456",
      locale: "uk",
    });

    await expect(verifyTwoFactor(initialState, formData)).rejects.toThrow("Create failed");

    expect(deletePreAuthSession).toHaveBeenCalledTimes(1);
    expect(createSession).toHaveBeenCalledTimes(1);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should return error when pre-auth session is missing", async () => {
    (verifyPreAuthSession as jest.Mock).mockResolvedValue(false);

    const formData = makeFormData({
      code: "123456",
      locale: "uk",
    });

    const result = await verifyTwoFactor(initialState, formData);

    expect(result).toEqual({
      fieldErrors: {
        code: ["Сесія авторизації закінчилася. Увійдіть знову."],
      },
      error: "",
      locale: "uk",
    });

    expect(validateTwoFactor).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
    expect(deletePreAuthSession).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
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

    expect(verifyPreAuthSession).toHaveBeenCalledTimes(1);
    expect(validateTwoFactor).toHaveBeenCalledWith("123456");

    expect(result).toEqual({
      fieldErrors: {
        code: ["Невірний код"],
      },
      error: "",
      needsTwoFactor: true,
      locale: "uk",
    });

    expect(deletePreAuthSession).not.toHaveBeenCalled();
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

    expect(redirect).toHaveBeenCalledWith("/en/management-console-12ak");
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
