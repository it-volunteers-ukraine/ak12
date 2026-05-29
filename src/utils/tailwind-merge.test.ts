import { cn } from "./tailwind-merge";

describe("cn", () => {
  it("should join multiple class names with a space", () => {
    expect(cn("text-sm", "font-bold")).toBe("text-sm font-bold");
  });

  it("should include conditional classes when truthy", () => {
    expect(cn("base", "active", false)).toBe("base active");
  });

  it("should support arrays and objects via clsx", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });

  it("should resolve tailwind conflicts keeping the last class", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("should merge conflicting color classes preserving the latter one", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });
});
