import { cn } from "@/utils";
import { Locale } from "@/types";
import { aboutUsSchema } from "@/schemas";
import { SECTION_KEYS } from "@/constants/section-key";
import { contentService } from "@/lib/content/content.service";

import { RenderCard } from "./card";

interface ILifeOfTheCorpsSectionProps {
  locale: Locale;
}

export const LifeOfTheCorpsSection = async ({ locale }: ILifeOfTheCorpsSectionProps) => {
  const content = await contentService.get({
    locale,
    schema: aboutUsSchema,
    section: SECTION_KEYS.ABOUT,
  });

  if (!content) {
    return null;
  }

  const calculateOrder = (index: number, cols: number) => {
    const row = Math.floor(index / cols);
    const isEvenRow = row % 2 === 0;

    if (isEvenRow) {
      return index;
    }

    return index % 2 === 0 ? index + 1 : index - 1;
  };

  const cells = content.content.gallery.slice(0, 9).flatMap((item, idx) => {
    const isImageOnly = idx >= 7;

    if (isImageOnly) {
      return [{ type: "image" as const, src: item?.secureUrl, id: `img-${idx}` }];
    }

    return [
      { type: "text" as const, text: item?.text, id: `txt-${idx}` },
      { type: "image" as const, src: item?.secureUrl, id: `img-${idx}` },
    ];
  });

  return (
    <section className="container-app md: w-full bg-black/90">
      <h2 className="font-ermilov text-accent mb-4 flex justify-center text-[40px] uppercase md:hidden">
        {cells[0].text}
      </h2>
      <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4")}>
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
              hideOnTablet={hideOnTablet}
              hideOnMobile={hideOnMobile}
              gridMobileOrder={gridMobileOrder}
              gridDesktopOrder={gridDesktopOrder}
            />
          );
        })}
      </div>
    </section>
  );
};
