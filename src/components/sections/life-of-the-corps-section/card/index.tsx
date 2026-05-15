'use client';

import Image from "next/image";

import { cn } from "@/utils";

interface ICard {
  gridIdx: number;
  hideOnMobile: boolean;
  hideOnTablet: boolean;
  gridMobileOrder: number;
  gridDesktopOrder: number;
  cell: {
    src?: string;
    text?: string;
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

export const RenderCard = ({ cell, gridDesktopOrder, hideOnTablet, gridMobileOrder, hideOnMobile, gridIdx }: ICard) => {
  console.log(gridMobileOrder, cell.text);

  return (
    <div
      className={cn(
        "order-(--gridMobileOrder) w-full md:order-0 lg:order-(--gridDesktopOrder)",
        hideOnMobile && "hidden md:block",
        hideOnMobile && !hideOnTablet && "md:block",
        hideOnTablet && "md:hidden lg:block",
      )}
      style={{ ["--gridMobileOrder" as string]: gridMobileOrder, ["--gridDesktopOrder" as string]: gridDesktopOrder }}
    >
      {cell.type === "text" ? (
        <div
          className={cn(
            "flex h-full w-full",
            gridIdx === 0 ? "md:items-start" : "items-center md:justify-center md:p-4",
          )}
        >
          <span
            className={cn(
              "text-accent font-ermilov text-center uppercase",
              gridIdx === 0
                ? "md:text-start md:text-4xl md:leading-snug lg:text-[clamp(2.25rem,1.4rem+1.8vw,3rem)]"
                : "text-[24px] lg:text-[30px]",
            )}
          >
            {cell.text}
          </span>
        </div>
      ) : (
        <div className="relative h-55 w-full overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt={cell.text || "Image"}
            src={cell.src || "/placeholder.jpg"}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
          />
          <CornerFrame />
        </div>
      )}
    </div>
  );
};
