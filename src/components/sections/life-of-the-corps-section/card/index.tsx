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
    imageIndex?: number;
    type: "text" | "image";
  };
}

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
          className={buttonImageClassName}
          onClick={() => onImageClick?.(cell.imageIndex ?? 0)}
        >
          <Image
            fill
            className="object-cover"
            alt={cell.text || "Image"}
            src={cell.src || GalleryPlaceholder}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
          />
          <CornerFrame />
        </button>
      )}
    </div>
  );
};
