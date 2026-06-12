import { getYouTubeVideoId, getYouTubeEmbedUrl } from "./youtube";

describe("getYouTubeVideoId", () => {
  it("should return null for an empty string", () => {
    expect(getYouTubeVideoId("")).toBeNull();
  });

  it("should extract id from youtu.be url", () => {
    expect(getYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("should extract id from youtube watch url", () => {
    expect(getYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("should extract id from mobile youtube url", () => {
    expect(getYouTubeVideoId("https://m.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("should extract id from music youtube url", () => {
    expect(getYouTubeVideoId("https://music.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("should return null for unsupported host", () => {
    expect(getYouTubeVideoId("https://example.com/watch?v=dQw4w9WgXcQ")).toBeNull();
  });

  it("should return null for invalid url", () => {
    expect(getYouTubeVideoId("not-a-url")).toBeNull();
  });
});

describe("getYouTubeEmbedUrl", () => {
  it("should build embed url for a valid youtube link", () => {
    expect(getYouTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    );
  });

  it("should return null when video id cannot be extracted", () => {
    expect(getYouTubeEmbedUrl("https://example.com/video")).toBeNull();
  });
});
