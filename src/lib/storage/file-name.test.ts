import { sanitizeFileName } from "./file-name";

describe("sanitizeFileName", () => {
  describe("valid filenames", () => {
    it("preserves alphanumeric characters", () => {
      expect(sanitizeFileName("photo123")).toBe("photo123");
      expect(sanitizeFileName("MyPhoto")).toBe("MyPhoto");
    });

    it("preserves underscores and hyphens", () => {
      expect(sanitizeFileName("my_photo-file")).toBe("my_photo-file");
    });

    it("trims whitespace before processing", () => {
      expect(sanitizeFileName("  photo  ")).toBe("photo");
      expect(sanitizeFileName("\tphoto\n")).toBe("photo");
    });

    it("replaces spaces with hyphens", () => {
      expect(sanitizeFileName("my photo")).toBe("my-photo");
      expect(sanitizeFileName("my  photo")).toBe("my-photo");
      expect(sanitizeFileName("my   photo   name")).toBe("my-photo-name");
    });

    it("replaces special characters with hyphens", () => {
      expect(sanitizeFileName("photo!@#$%")).toBe("photo");
      expect(sanitizeFileName("my@photo")).toBe("my-photo");
    });

    it("removes consecutive hyphens", () => {
      expect(sanitizeFileName("photo---name")).toBe("photo-name");
      expect(sanitizeFileName("photo!!!name")).toBe("photo-name");
    });

    it("removes leading and trailing hyphens", () => {
      expect(sanitizeFileName("-photo-")).toBe("photo");
      expect(sanitizeFileName("---photo---")).toBe("photo");
    });

    it("handles complex filenames", () => {
      expect(sanitizeFileName("My Photo! (2024)")).toBe("My-Photo-2024");
      expect(sanitizeFileName("_file--name__test_")).toBe("_file-name__test_");
    });

    it("handles dots (kept or replaced based on content)", () => {
      expect(sanitizeFileName("photo.name")).toBe("photo-name");
    });

    it("handles unicode characters by replacing with hyphens", () => {
      expect(() => sanitizeFileName("фото")).toThrow(/Не вдалося сформувати коректну назву файлу/);
      expect(sanitizeFileName("café")).toBe("caf");
    });
  });

  describe("invalid filenames", () => {
    it("throws on empty string", () => {
      expect(() => sanitizeFileName("")).toThrow("Назва файлу є обов'язковою");
    });

    it("throws on whitespace-only string", () => {
      expect(() => sanitizeFileName("   ")).toThrow("Назва файлу є обов'язковою");
      expect(() => sanitizeFileName("\t\n")).toThrow("Назва файлу є обов'язковою");
    });

    it("throws when result becomes empty after sanitization", () => {
      expect(() => sanitizeFileName("!@#$%^&*()")).toThrow(/Не вдалося сформувати коректну назву файлу/);
    });

    it("throws when result is only hyphens", () => {
      expect(() => sanitizeFileName("---")).toThrow(/Не вдалося сформувати коректну назву файлу/);
    });

    it("throws on special characters only", () => {
      expect(() => sanitizeFileName("!!!...")).toThrow(/Не вдалося сформувати коректну назву файлу/);
    });

    it("throws on unicode-only string", () => {
      expect(() => sanitizeFileName("привіт")).toThrow(/Не вдалося сформувати коректну назву файлу/);
    });
  });

  describe("edge cases", () => {
    it("handles mixed valid and invalid content", () => {
      expect(sanitizeFileName("a@b#c$d")).toBe("a-b-c-d");
    });

    it("handles filename with only underscores and numbers", () => {
      expect(sanitizeFileName("_123_456_")).toBe("_123_456_");
    });

    it("handles very long filename", () => {
      const longName = "a".repeat(100);

      expect(sanitizeFileName(longName)).toBe(longName);
    });

    it("handles single character", () => {
      expect(sanitizeFileName("a")).toBe("a");
    });

    it("handles single number", () => {
      expect(sanitizeFileName("1")).toBe("1");
    });

    it("preserves numbers in filename", () => {
      expect(sanitizeFileName("2024-01-15")).toBe("2024-01-15");
    });
  });
});
