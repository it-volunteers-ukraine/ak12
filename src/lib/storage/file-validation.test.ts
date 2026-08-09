import { validateImageFile } from "./file-validation";

const makeFile = (overrides: Partial<File> = {}, content = "fake-image-bytes") => {
  const baseSize = content.length;
  const base = new File([content], "photo.png", { type: "image/png" });

  return Object.defineProperties(base, {
    type: { value: overrides.type ?? base.type, configurable: true },
    size: { value: overrides.size ?? baseSize, configurable: true },
  }) as File;
};

describe("validateImageFile", () => {
  describe("allowed MIME types", () => {
    it.each(["image/jpeg", "image/jpg", "image/png", "image/webp"])("accepts %s", async (type) => {
      const file = makeFile({ type, size: 1024 });

      await expect(validateImageFile(file)).resolves.toBeUndefined();
    });
  });

  describe("file size validation", () => {
    it("accepts file at exactly 5 MB limit", async () => {
      const file = makeFile({ type: "image/png", size: 5 * 1024 * 1024 });

      await expect(validateImageFile(file)).resolves.toBeUndefined();
    });

    it("accepts file under 5 MB", async () => {
      const file = makeFile({ type: "image/png", size: 1024 });

      await expect(validateImageFile(file)).resolves.toBeUndefined();
    });

    it("rejects file larger than 5 MB", async () => {
      const file = makeFile({ type: "image/png", size: 5 * 1024 * 1024 + 1 });

      await expect(validateImageFile(file)).rejects.toThrow(/5 MB/);
    });
  });

  describe("unsupported formats", () => {
    it.each(["application/pdf", "video/mp4", "text/plain", "application/json"])("rejects %s", async (type) => {
      const file = makeFile({ type, size: 1024 });

      await expect(validateImageFile(file)).rejects.toThrow(/JPG, JPEG, PNG, WEBP/);
    });
  });

  describe("edge cases", () => {
    it("rejects empty MIME type", async () => {
      const file = makeFile({ type: "", size: 1024 });

      await expect(validateImageFile(file)).rejects.toThrow(/JPG, JPEG, PNG, WEBP/);
    });

    it("accepts file with size 0 (allowed by this validator)", async () => {
      const file = makeFile({ type: "image/png", size: 0 });

      await expect(validateImageFile(file)).resolves.toBeUndefined();
    });

    it("rejects file just over limit with exact message", async () => {
      const file = makeFile({ type: "image/png", size: 5 * 1024 * 1024 + 100 });

      await expect(validateImageFile(file)).rejects.toThrow("Максимальна вага файлу — 5 MB");
    });
  });
});
