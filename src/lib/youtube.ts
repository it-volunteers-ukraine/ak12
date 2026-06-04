export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) {
    return null;
  }

  try {
    const { hostname, pathname, searchParams } = new URL(url);

    if (hostname === "youtu.be") {
      return pathname.slice(1).split("?")[0];
    }

    const allowedYouTubeHosts = new Set([
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "music.youtube.com",
    ]);

    if (allowedYouTubeHosts.has(hostname)) {
      return searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
};

export const getYouTubeEmbedUrl = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};