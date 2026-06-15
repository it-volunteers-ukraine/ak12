import { LOCALES } from "./types";

describe("form-builder types", () => {
  it("should expose locales", () => {
    expect(LOCALES).toEqual(["uk", "en"]);
  });
});
