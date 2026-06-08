import { Locale } from "@/types";
import { logger } from "@/lib/logger";
import { aboutUsSchema } from "@/schemas";
import { SECTION_KEYS } from "@/constants/section-key";
import { contentService } from "@/lib/content/content.service";

import { LifeOfTheCorpsGalleryClient } from "./gallery/gallery-client";

interface ILifeOfTheCorpsSectionProps {
  locale: Locale;
}

export const LifeOfTheCorpsSection = async ({ locale }: ILifeOfTheCorpsSectionProps) => {
  let content;

  try {
    content = await contentService.get({
      locale,
      schema: aboutUsSchema,
      section: SECTION_KEYS.ABOUT,
    });
  } catch (error) {
    logger.error({ error, locale, section: SECTION_KEYS.ABOUT }, "Failed to load LifeOfTheCorpsSection content");

    return null;
  }

  if (!content) {
    return null;
  }

  const fullGallery = content.content.gallery ?? [];

  const mediaIndexByGalleryIndex = new Map<number, number>();

  // Будуємо список медіа для Swiper — враховуємо mediaType
  const images = fullGallery
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => {
      if (!item) {
        return false;
      }

      const mediaType = item.mediaType ?? "image";

      if (mediaType === "video") {
        return Boolean(item.videoUrl);
      }

      return Boolean(item.secureUrl);
    })
    .map(({ item, idx }, mediaIndex) => {
      mediaIndexByGalleryIndex.set(idx, mediaIndex);

      const mediaType = item?.mediaType ?? "image";

      return {
        text: item?.text,
        id: `gallery-media-${idx}`,
        src: mediaType === "image" ? item?.secureUrl || "" : "",
        videoUrl: mediaType === "video" ? item?.videoUrl || "" : "",
      };
    });

  const cells = fullGallery.slice(0, 9).flatMap((item, idx) => {
    const isImageOnly = idx >= 7;
    const mediaIndex = mediaIndexByGalleryIndex.get(idx) ?? -1;
    const mediaType = item?.mediaType ?? "image";

    // Визначаємо що показувати в клітинці гріду
    const cellSrc = mediaType === "image" ? item?.secureUrl : undefined;
    const cellVideoUrl = mediaType === "video" ? item?.videoUrl : undefined;

    if (isImageOnly) {
      return [
        {
          type: "image" as const,
          src: cellSrc,
          videoUrl: cellVideoUrl,
          id: `img-${idx}`,
          imageIndex: mediaIndex,
        },
      ];
    }

    return [
      { type: "text" as const, text: item?.text, id: `txt-${idx}` },
      {
        type: "image" as const,
        src: cellSrc,
        videoUrl: cellVideoUrl,
        id: `img-${idx}`,
        imageIndex: mediaIndex,
      },
    ];
  });

  return (
    <section className="relative h-full w-full overflow-hidden bg-[url('/images/Background.webp')] bg-repeat">
      <div className="absolute inset-0 z-1 bg-linear-to-r from-black/85 via-black/55 to-transparent" />
      <LifeOfTheCorpsGalleryClient cells={cells} images={images} />
    </section>
  );
};
