import { aboutUsSchema } from "./about-us.schema";

describe("aboutUsSchema", () => {
  it("should accept valid about us content with image item", () => {
    const result = aboutUsSchema.safeParse({
      mainTitle: "About us",
      description: "Description",
      content: {
        gallery: [
          {
            text: "Image item",
            mediaType: "image",
            secureUrl: "https://example.com/image.jpg",
            publicId: "image-1",
          },
        ],
      },
    });

    expect(result.success).toBe(true);
  });

  it("should accept valid about us content with youtube video", () => {
    const result = aboutUsSchema.safeParse({
      mainTitle: "About us",
      description: "Description",
      content: {
        gallery: [
          {
            text: "Video item",
            mediaType: "video",
            videoUrl: "https://www.youtube.com/watch?v=test123",
          },
        ],
      },
    });

    expect(result.success).toBe(true);
  });

  it("should accept youtu.be video url", () => {
    const result = aboutUsSchema.safeParse({
      mainTitle: "About us",
      description: "Description",
      content: {
        gallery: [
          {
            text: "Video item",
            mediaType: "video",
            videoUrl: "https://youtu.be/test123",
          },
        ],
      },
    });

    expect(result.success).toBe(true);
  });

  it("should accept empty video url", () => {
    const result = aboutUsSchema.safeParse({
      mainTitle: "About us",
      description: "Description",
      content: {
        gallery: [
          {
            text: "Video item",
            mediaType: "video",
            videoUrl: "",
          },
        ],
      },
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid youtube url", () => {
    const result = aboutUsSchema.safeParse({
      mainTitle: "About us",
      description: "Description",
      content: {
        gallery: [
          {
            text: "Video item",
            mediaType: "video",
            videoUrl: "https://vimeo.com/video",
          },
        ],
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject empty main title", () => {
    const result = aboutUsSchema.safeParse({
      mainTitle: "",
      description: "Description",
      content: {
        gallery: [
          {
            text: "Item",
          },
        ],
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject empty description", () => {
    const result = aboutUsSchema.safeParse({
      mainTitle: "About us",
      description: "",
      content: {
        gallery: [
          {
            text: "Item",
          },
        ],
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject gallery item without text", () => {
    const result = aboutUsSchema.safeParse({
      mainTitle: "About us",
      description: "Description",
      content: {
        gallery: [
          {
            text: "",
          },
        ],
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject empty gallery", () => {
    const result = aboutUsSchema.safeParse({
      mainTitle: "About us",
      description: "Description",
      content: {
        gallery: [],
      },
    });

    expect(result.success).toBe(false);
  });

  it("should accept nullable gallery item", () => {
    const result = aboutUsSchema.safeParse({
      mainTitle: "About us",
      description: "Description",
      content: {
        gallery: [null],
      },
    });

    expect(result.success).toBe(true);
  });

  it("should accept undefined gallery item", () => {
    const result = aboutUsSchema.safeParse({
      mainTitle: "About us",
      description: "Description",
      content: {
        gallery: [undefined],
      },
    });

    expect(result.success).toBe(true);
  });
});
