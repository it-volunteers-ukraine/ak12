'use client';

import Image from "next/image";

import { getStyles } from "./styles";
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

const CornerFrame = () => (
  <>
    {/* Верхній лівий кут */}
    <span className="border-accent absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2" />
    {/* Верхній правий кут */}
    <span className="border-accent absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2" />
    {/* Нижній лівий кут */}
    <span className="border-accent absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2" />
    {/* Нижній правий кут */}
    <span className="border-accent absolute right-0 bottom-0 h-5 w-5 border-r-2 border-b-2" />
  </>
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
  const { cardWrapperClassName, cardWrapperStyle, textStylesClassName, textWrapperClassName } = getStyles({
    gridIdx,
    hideOnMobile,
    hideOnTablet,
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
          onClick={() => onImageClick?.(cell.imageIndex ?? 0)}
          className="relative h-55 w-full cursor-pointer transition-transform duration-300 lg:hover:z-20 lg:hover:scale-125"
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
