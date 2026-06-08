import { logout } from "./logout";
import { deleteSession } from "@/lib/auth/session.service";
import { redirect } from "next/navigation";

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
  it("should delete session and redirect to provided locale", async () => {
    const formData = makeFormData({
      locale: "en",
    });

    await expect(logout(formData)).rejects.toThrow("NEXT_REDIRECT");

    expect(deleteSession).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/en");
  });

  it("should default to uk locale when locale is not provided", async () => {
    const formData = new FormData();

    await expect(logout(formData)).rejects.toThrow("NEXT_REDIRECT");

    expect(deleteSession).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/uk");
  });
});
