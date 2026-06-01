import { buildLocalPath } from "./buildLocalPath";

describe("buildLocalPath", () => {
  it("should prepend the locale to the path", () => {
    expect(buildLocalPath("uk", "/about")).toBe("/uk/about");
  });

  it("should support the english locale", () => {
    expect(buildLocalPath("en", "/vacancies")).toBe("/en/vacancies");
  });

  it("should preserve nested paths", () => {
    expect(buildLocalPath("uk", "/vacancies/frontline")).toBe("/uk/vacancies/frontline");
  });

  it("should support paths with query strings", () => {
    expect(buildLocalPath("en", "/search?q=tank")).toBe("/en/search?q=tank");
  });
});
