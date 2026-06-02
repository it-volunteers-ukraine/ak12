'use client';

import { useState } from "react";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";

import { Modal } from "@/components/modal";

import { RenderCard } from "../card";
import { CloseIcon } from "../../../../../public/icons";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Cell = {
  id: string;
  src?: string;
  text?: string;
  videoUrl?: string;
  imageIndex?: number;
  type: "text" | "image";
};

type GalleryImage = {
  id: string;
  src: string;
  text?: string;
  videoUrl?: string;
};

interface ILifeOfTheCorpsGalleryClientProps {
  cells: Cell[];
  images: GalleryImage[];
}

const MOBILE_ORDER_OVERRIDES: Record<number, number> = {
  1: 5,
  4: 7,
  6: 4,
  5: 6,
  8: 12,
  12: 14,
};

const MOBILE_HIDDEN_INDEXES = new Set([0, 15]);

const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) {
    return null;
  }

  try {
    const urlObj = new URL(url);
    let videoId: string | null = null;

    if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1).split("?")[0];
    } else if (urlObj.hostname.includes("youtube.com")) {
      videoId = urlObj.searchParams.get("v");
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
};

export const LifeOfTheCorpsGalleryClient = ({ cells, images }: ILifeOfTheCorpsGalleryClientProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const TABLET_HIDE_START_INDEX = cells.length - 1;

  const calculateOrder = (index: number, cols: number) => {
    const row = Math.floor(index / cols);
    const isEvenRow = row % 2 === 0;

    if (isEvenRow) {
      return index;
    }

    return index % 2 === 0 ? index + 1 : index - 1;
  };

  const openGallery = (imageIndex: number) => {
    if (imageIndex === -1) {
      return;
    }

    setActiveImageIndex(imageIndex);
    setIsOpen(true);
  };

  const buildUniqueMobileOrders = (total: number) => {
    const usedOrders = new Set<number>();
    const uniqueOrders: number[] = [];

    for (let index = 0; index < total; index++) {
      let desiredOrder = MOBILE_ORDER_OVERRIDES[index] ?? index;

      while (usedOrders.has(desiredOrder)) {
        desiredOrder += 1;
      }

      usedOrders.add(desiredOrder);
      uniqueOrders[index] = desiredOrder;
    }

    return uniqueOrders;
  };

  const mobileOrders = buildUniqueMobileOrders(cells.length);
  const getGridMobileOrder = (index: number) => mobileOrders[index] ?? index;
  const shouldHideOnTablet = (index: number) => index >= TABLET_HIDE_START_INDEX;
  const shouldHideOnMobile = (index: number) => MOBILE_HIDDEN_INDEXES.has(index);

  return (
    <>
      <h2 className="font-ermilov text-accent relative z-10 mb-4 flex justify-center text-[40px] uppercase md:hidden">
        {cells[0]?.text}
      </h2>
      <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {cells.map((cell, gridIdx) => {
          const hideOnTablet = shouldHideOnTablet(gridIdx);
          const gridDesktopOrder = calculateOrder(gridIdx, 4);
          const gridMobileOrder = getGridMobileOrder(gridIdx);
          const hideOnMobile = shouldHideOnMobile(gridIdx);

          return (
            <RenderCard
              cell={cell}
              key={cell.id}
              gridIdx={gridIdx}
              onImageClick={openGallery}
              hideOnTablet={hideOnTablet}
              hideOnMobile={hideOnMobile}
              gridMobileOrder={gridMobileOrder}
              gridDesktopOrder={gridDesktopOrder}
            />
          );
        })}
      </div>

      <Modal
        isOpen={isOpen}
        classNameOverlay="bg-black/85"
        closeModal={() => setIsOpen(false)}
        className="relative w-[92vw] max-w-300 rounded-lg bg-black p-4 md:p-6"
      >
        <button
          type="button"
          aria-label="Close gallery"
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/90"
        >
          <CloseIcon className="text-accent h-5 w-5 transition duration-200 ease-in-out hover:scale-150" />
        </button>
        <Swiper
          navigation
          keyboard={{ enabled: true }}
          initialSlide={activeImageIndex}
          pagination={{ clickable: true }}
          className="gallery-swiper w-full"
          modules={[Navigation, Pagination, Keyboard]}
          style={
            {
              "--swiper-navigation-color": "#F7D704",
              "--swiper-pagination-color": "#F7D704",
              "--swiper-navigation-size": "40px",
            } as React.CSSProperties
          }
        >
          {images.map((image, idx) => {
            const embedUrl = image.videoUrl ? getYouTubeEmbedUrl(image.videoUrl) : null;

            return (
              <SwiperSlide key={`${image.id}-${idx}`}>
                <div className="relative flex h-[70vh] min-h-80 w-full items-center justify-center overflow-hidden rounded-md bg-black">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={image.text || `Video ${idx + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  ) : (
                    <Image
                      fill
                      src={image.src}
                      className="object-contain"
                      priority={idx === activeImageIndex}
                      alt={image.text || `Image ${idx + 1}`}
                      sizes="(max-width: 768px) 92vw, (max-width: 1200px) 80vw, 1200px"
                    />
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Modal>
    </>
  );
};