/**
 * @jest-environment node
 */
import { routes } from "@/constants/routes";

describe("robots", () => {
  it("should return a robots MetadataRoute with rules", () => {
    const robots = require("./robots").default;
    const result = robots();

    expect(result).toBeDefined();
    expect(result.rules).toBeDefined();
  });

  it("should have userAgent set to wildcard", () => {
    const robots = require("./robots").default;
    const result = robots();

    expect(result.rules.userAgent).toBe("*");
  });

  it("should allow root path", () => {
    const robots = require("./robots").default;
    const result = robots();

    expect(result.rules.allow).toBe("/");
  });

  it("should disallow admin paths for all locales", () => {
    const robots = require("./robots").default;
    const result = robots();

    expect(Array.isArray(result.rules.disallow)).toBe(true);
    expect(result.rules.disallow).toContain(`/uk${routes.admin.home}/`);
    expect(result.rules.disallow).toContain(`/en${routes.admin.home}/`);
  });

  it("should disallow login paths for all locales", () => {
    const robots = require("./robots").default;
    const result = robots();

    expect(result.rules.disallow).toContain("/uk/login/");
    expect(result.rules.disallow).toContain("/en/login/");
  });

  it("should have disallow list as array", () => {
    const robots = require("./robots").default;
    const result = robots();

    expect(Array.isArray(result.rules.disallow)).toBe(true);
    expect(result.rules.disallow.length).toBeGreaterThan(0);
  });

  it("should return the same result on multiple calls", () => {
    const robots = require("./robots").default;
    const result1 = robots();
    const result2 = robots();

    expect(result1).toEqual(result2);
  });

  it("should return object matching MetadataRoute.Robots structure", () => {
    const robots = require("./robots").default;
    const result = robots();

    expect(result).toMatchObject({
      rules: expect.objectContaining({
        userAgent: expect.any(String),
        allow: expect.any(String),
        disallow: expect.any(Array),
      }),
    });
  });
});
