import { formatSalary } from "./format-salary";

const normalizeSpaces = (value: string) => value.replace(/\s/g, " ");

describe("formatSalary", () => {
  it("should format a 4-digit value using a uk-UA thousands separator", () => {
    expect(normalizeSpaces(formatSalary(1000))).toBe("1 000");
  });

  it("should format a 6-digit value with multiple groupings", () => {
    expect(normalizeSpaces(formatSalary(123456))).toBe("123 456");
  });

  it("should format a 7-digit value", () => {
    expect(normalizeSpaces(formatSalary(1234567))).toBe("1 234 567");
  });

  it("should leave small numbers untouched", () => {
    expect(formatSalary(42)).toBe("42");
  });

  it("should format zero as '0'", () => {
    expect(formatSalary(0)).toBe("0");
  });
});
