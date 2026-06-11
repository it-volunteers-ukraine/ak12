"use client";

import { useRef } from "react";

import { AboutUsContent } from "@/schemas";
import { useTopFromViewportMinusContent } from "@/hooks/useTopFromViewportMinusContent";

import { LifeOfTheCorpsGalleryClient } from "./gallery/gallery-client";

export const LifeOfTheCorpsSection = ({ content }: { content: AboutUsContent | null }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const top = useTopFromViewportMinusContent(sectionRef);

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
    <section
      ref={sectionRef}
      id="life-of-the-corps"
      className="container-app sticky w-full overflow-hidden bg-black/95"
      style={{ zIndex: 3, top: `${top}px` }}
    >
      <LifeOfTheCorpsGalleryClient cells={cells} images={images} />
    </section>
  );
};
