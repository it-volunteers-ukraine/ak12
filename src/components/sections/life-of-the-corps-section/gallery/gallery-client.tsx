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
  imageIndex?: number;
  type: "text" | "image";
};
type GalleryImage = {
  id: string;
  src: string;
  text?: string;
};
interface ILifeOfTheCorpsGalleryClientProps {
  cells: Cell[];
  images: GalleryImage[];
}

export const LifeOfTheCorpsGalleryClient = ({ cells, images }: ILifeOfTheCorpsGalleryClientProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const calculateOrder = (index: number, cols: number) => {
    const row = Math.floor(index / cols);
    const isEvenRow = row % 2 === 0;

    if (isEvenRow) {
      return index;
    }

    return index % 2 === 0 ? index + 1 : index - 1;
  };

  const openGallery = (imageIndex: number) => {
    setActiveImageIndex(imageIndex);
    setIsOpen(true);
  };

  return (
    <>
      <h2 className="font-ermilov text-accent relative z-10 mb-4 flex justify-center text-[40px] uppercase md:hidden">
        {cells[0]?.text}
      </h2>
      <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {cells.map((cell, gridIdx) => {
          const hideOnTablet = gridIdx >= 15;
          const gridDesktopOrder = calculateOrder(gridIdx, 4);

          let gridMobileOrder = gridIdx;

          if (gridIdx === 1) {
            gridMobileOrder = 5;
          }
          if (gridIdx === 4) {
            gridMobileOrder = 6;
          }
          if (gridIdx === 6) {
            gridMobileOrder = 4;
          }
          if (gridIdx === 7) {
            gridMobileOrder = 5;
          }
          if (gridIdx === 5) {
            gridMobileOrder = 7;
          }
          if (gridIdx === 9) {
            gridMobileOrder = 7;
          }
          if (gridIdx === 13) {
            gridMobileOrder = 9;
          }

          const hideOnMobile = [0, 15].includes(gridIdx);

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
          {images.map((image, idx) => (
            <SwiperSlide key={`${image.id}-${idx}`}>
              <div className="relative flex h-[70vh] min-h-80 w-full items-center justify-center overflow-hidden rounded-md bg-black">
                <Image
                  fill
                  src={image.src}
                  className="object-contain"
                  priority={idx === activeImageIndex}
                  alt={image.text || `Image ${idx + 1}`}
                  sizes="(max-width: 768px) 92vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Modal>
    </>
  );
};
