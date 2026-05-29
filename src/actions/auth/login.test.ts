import { adminLogin } from "./login";
import { createSession, validateAdmin } from "@/lib/auth/session.service";
import { redirect } from "next/navigation";

jest.mock("@/lib/auth/session.service", () => ({
  createSession: jest.fn(),
  validateAdmin: jest.fn(),
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

const initialState = { fieldErrors: {}, error: "" };

beforeEach(() => {
  jest.clearAllMocks();
});

describe("adminLogin", () => {
  it("should create a session and redirect to the locale-aware admin path on valid credentials", async () => {
    (validateAdmin as jest.Mock).mockResolvedValue(true);

    const formData = makeFormData({
      email: "admin@example.com",
      password: "Strong-Pass-1234",
      locale: "uk",
    });

    await expect(adminLogin(initialState, formData)).rejects.toThrow("NEXT_REDIRECT");

    expect(validateAdmin).toHaveBeenCalledWith("admin@example.com", "Strong-Pass-1234");
    expect(createSession).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/uk/admin");
  });

  it("should default to the uk locale when no locale field is provided", async () => {
    (validateAdmin as jest.Mock).mockResolvedValue(true);

    const formData = makeFormData({
      email: "admin@example.com",
      password: "Strong-Pass-1234",
    });

    await expect(adminLogin(initialState, formData)).rejects.toThrow("NEXT_REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/uk/admin");
  });

  it("should honour an explicit en locale on redirect", async () => {
    (validateAdmin as jest.Mock).mockResolvedValue(true);

    const formData = makeFormData({
      email: "admin@example.com",
      password: "Strong-Pass-1234",
      locale: "en",
    });

    await expect(adminLogin(initialState, formData)).rejects.toThrow("NEXT_REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/en/admin");
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
});
