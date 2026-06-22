import { isAdminSectionKey } from "@/lib/admin/admin-types";
import { ADMIN_SCHEMAS } from "@/lib/admin/admin-schemas";

jest.mock("@/lib/admin/admin-schemas", () => ({
  ADMIN_SCHEMAS: {
    about: {},
    contacts: {},
  },
}));

describe("isAdminSectionKey", () => {
  it("returns true for valid admin keys", () => {
    expect(isAdminSectionKey("about")).toBe(true);
    expect(isAdminSectionKey("contacts")).toBe(true);
  });

  it("returns false for invalid keys", () => {
    expect(isAdminSectionKey("unknown")).toBe(false);
    expect(isAdminSectionKey("")).toBe(false);
    expect(isAdminSectionKey("random")).toBe(false);
  });

  it("reacts to dynamic ADMIN_SCHEMAS changes", () => {
    (ADMIN_SCHEMAS as any).dashboard = {};

    expect(isAdminSectionKey("dashboard")).toBe(true);
  });
});
