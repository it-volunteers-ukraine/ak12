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

  it.each([
    ["userAgent", "*"],
    ["allow", "/"],
  ])("should have %s set correctly", (property, expected) => {
    const robots = require("./robots").default;
    const result = robots();

    expect(result.rules[property]).toBe(expected);
  });

  it.each([
    ["uk", `/uk${routes.admin.home}/`],
    ["en", `/en${routes.admin.home}/`],
  ])("should disallow admin path for %s locale", (_, path) => {
    const robots = require("./robots").default;
    const result = robots();

    expect(Array.isArray(result.rules.disallow)).toBe(true);
    expect(result.rules.disallow).toContain(path);
  });

  it.each([
    ["uk", "/uk/login/"],
    ["en", "/en/login/"],
  ])("should disallow login path for %s locale", (_, path) => {
    const robots = require("./robots").default;
    const result = robots();

    expect(result.rules.disallow).toContain(path);
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
