import Image from "next/image";

import { Locale } from "@/types";
import { logger } from "@/lib/logger";
import { aboutUsSchema } from "@/schemas";
import { SECTION_KEYS } from "@/constants/section-key";
import { contentService } from "@/lib/content/content.service";

import { Background } from "../../../../public/images";
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

  // images тепер включає і фото і відео (для Swiper)
  const images = fullGallery
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => Boolean(item?.secureUrl) || Boolean(item?.videoUrl))
    .map(({ item, idx }, mediaIndex) => {
      mediaIndexByGalleryIndex.set(idx, mediaIndex);

      return {
        text: item?.text,
        id: `gallery-media-${idx}`,
        src: item?.secureUrl || "",
        videoUrl: item?.videoUrl || "",
      };
    });

  const cells = fullGallery.slice(0, 9).flatMap((item, idx) => {
    const isImageOnly = idx >= 7;
    const mediaIndex = mediaIndexByGalleryIndex.get(idx) ?? -1;

    if (isImageOnly) {
      return [
        {
          type: "image" as const,
          src: item?.secureUrl,
          videoUrl: item?.videoUrl,
          id: `img-${idx}`,
          imageIndex: mediaIndex,
        },
      ];
    }

    return [
      { type: "text" as const, text: item?.text, id: `txt-${idx}` },
      {
        type: "image" as const,
        src: item?.secureUrl,
        videoUrl: item?.videoUrl,
        id: `img-${idx}`,
        imageIndex: mediaIndex,
      },
    ];
  });

  return (
    <section className="container-app relative w-full overflow-hidden bg-black/95">
      <Image
        fill
        priority
        sizes="100vw"
        src={Background}
        alt="Background"
        className="absolute inset-0 z-0 object-cover"
      />
      <div className="absolute inset-0 z-1 bg-linear-to-r from-black/85 via-black/55 to-transparent" />
      <LifeOfTheCorpsGalleryClient cells={cells} images={images} />
    </section>
  );
};