"use client";

import Image from "next/image";

import { getStyles } from "./styles";
import { CornerFrame } from "@/components/cornerFrame";
import { GalleryPlaceholder } from "../../../../../public/images";

interface ICard {
  gridIdx: number;
  hideOnMobile: boolean;
  hideOnTablet: boolean;
  gridMobileOrder: number;
  gridDesktopOrder: number;
  onImageClick?: (imageIndex: number) => void;
  cell: {
    src?: string;
    text?: string;
    videoUrl?: string;
    imageIndex?: number;
    type: "text" | "image";
  };
}

const CornerFrame = () => (
  <>
    <span className="border-accent absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2" />
    <span className="border-accent absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2" />
    <span className="border-accent absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2" />
    <span className="border-accent absolute right-0 bottom-0 h-5 w-5 border-r-2 border-b-2" />
  </>
);

const getYouTubeVideoId = (url: string): string | null => {
  if (!url) {
    return null;
  }

  try {
    const urlObj = new URL(url);

    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1).split("?")[0];
    }

    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
};

const PlayIcon = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 transition-transform duration-200 group-hover:scale-110">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-accent ml-1 h-7 w-7"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  </div>
);

export const RenderCard = ({
  cell,
  gridIdx,
  hideOnTablet,
  hideOnMobile,
  onImageClick,
  gridMobileOrder,
  gridDesktopOrder,
}: ICard) => {
  const isPlaceholder = cell.type === "image" && cell.imageIndex === -1;
  const videoId = cell.videoUrl ? getYouTubeVideoId(cell.videoUrl) : null;
  const hasVideo = Boolean(videoId);
  const hasImage = Boolean(cell.src);

  const { cardWrapperClassName, cardWrapperStyle, textStylesClassName, textWrapperClassName, buttonImageClassName } =
    getStyles({
      gridIdx,
      hideOnMobile,
      hideOnTablet,
      isPlaceholder,
      gridMobileOrder,
      gridDesktopOrder,
    });

  return (
    <div className={cardWrapperClassName} style={cardWrapperStyle}>
      {cell.type === "text" ? (
        <div className={textWrapperClassName}>
          <span className={textStylesClassName}>{cell.text}</span>
        </div>
      ) : (
        <button
          disabled={isPlaceholder}
          className={`${buttonImageClassName} group`}
          onClick={() => onImageClick?.(cell.imageIndex ?? 0)}
        >
          {hasVideo && !hasImage ? (
            // відео thumbnail через YouTube API
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={cell.text || "Video"}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <PlayIcon />
            </>
          ) : (
            <Image
              fill
              className="object-cover"
              alt={cell.text || "Image"}
              src={cell.src || GalleryPlaceholder}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
            />
          )}
          <CornerFrame />
        </button>
      )}
    </div>
  );
};