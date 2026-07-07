import { ADMIN_SCHEMAS } from "@/lib/admin/admin-schemas";

describe("ADMIN_SCHEMAS", () => {
  const schemas = Object.values(ADMIN_SCHEMAS);

  it("should have uk/en wrapper structure", () => {
    for (const schema of schemas) {
      const result = schema.safeParse({
        uk: {},
        en: {},
      });

      expect(result.error?.issues.some((i) => i.path[0] === "uk" || i.path[0] === "en") ?? true).toBe(true);
    }
  });

  it("should reject missing uk", () => {
    for (const schema of schemas) {
      const result = schema.safeParse({
        en: {},
      });

      expect(result.success).toBe(false);
    }
  });

  it("should reject missing en", () => {
    for (const schema of schemas) {
      const result = schema.safeParse({
        uk: {},
      });

      expect(result.success).toBe(false);
    }
  });

  it("should reject empty object", () => {
    for (const schema of schemas) {
      const result = schema.safeParse({});

      expect(result.success).toBe(false);
    }
  });

  it("should ensure schema is callable Zod schema", () => {
    for (const schema of schemas) {
      expect(typeof schema.safeParse).toBe("function");
      expect(typeof schema.parse).toBe("function");
    }
  });
});
