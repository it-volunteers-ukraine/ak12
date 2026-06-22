import { LOCALES } from "@/lib/form-builder/types";

describe("form-builder types", () => {
  it("should expose locales", () => {
    expect(LOCALES).toEqual(["uk", "en"]);
  });
});
