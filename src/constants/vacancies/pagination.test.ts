import { DEFAULT_PAGE, DEFAULT_LIMIT } from "./pagination";

describe("pagination constants", () => {
  it("DEFAULT_PAGE should be 0", () => {
    expect(DEFAULT_PAGE).toBe(0);
  });

  it("DEFAULT_LIMIT should be 8", () => {
    expect(DEFAULT_LIMIT).toBe(8);
  });
});
