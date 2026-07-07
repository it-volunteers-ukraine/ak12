import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/auth/session.service";
import { logout } from "@/actions/auth/logout.action";

jest.mock("@/lib/auth/session.service", () => ({
  deleteSession: jest.fn(),
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

beforeEach(() => {
  jest.clearAllMocks();
});

describe("logout", () => {
  it.each([
    ["en locale", makeFormData({ locale: "en" }), "/en"],
    ["default locale", new FormData(), "/uk"],
  ])("should redirect using %s", async (_, formData, expectedRedirect) => {
    await expect(logout(formData)).rejects.toThrow("NEXT_REDIRECT");

    expect(deleteSession).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(expectedRedirect);
  });
});
