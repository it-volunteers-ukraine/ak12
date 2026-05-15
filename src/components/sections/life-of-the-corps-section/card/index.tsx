'use client';

import Image from "next/image";

import { cn } from "@/utils";
import { useWindowWidth } from "@/hooks";

interface ICard {
    desktopOrder: number;
    hideOnTablet: boolean;
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

export const Card = ({cell, desktopOrder, hideOnTablet} : ICard) => {
      const {isMobile, isNotMobile} = useWindowWidth()
    
  return <> {isNotMobile && (
  
              <div
                className={cn("h-55 w-full lg:order-(--desktop-order)", hideOnTablet && "md:hidden lg:block")}
                style={{ ["--desktop-order" as string]: desktopOrder }}
              >
                {cell.type === "text" ? (
                  <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="text-accent text-center font-ermilov text-[24px] uppercase lg:text-[30px]">
                      {cell.text}
                    </span>
                  </div>
                ) : (
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <Image src={cell.src || "/placeholder.jpg"} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw" className="object-cover " />
                    <CornerFrame />
                  </div>
                )}
              </div> 
            )}
            {isMobile && (
              <div > 
                 {cell.type === "text" ? (
                  <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="text-accent text-center font-ermilov text-[24px] uppercase lg:text-[30px]">
                      {cell.text}
                    </span>
                  </div>
                ) : (
                  <div className="relative  w-full overflow-hidden rounded-xl h-55">
                    <Image src={cell.src || "/placeholder.jpg"} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw" className="object-cover w-full h-full" />
                    <CornerFrame />
                  </div>
                )}
              </div>
  
            )}</>;
};
