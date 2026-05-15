import { cn } from "@/utils";
import { Locale } from "@/types";
import { aboutUsSchema } from "@/schemas";
import { SECTION_KEYS } from "@/constants/section-key";
import { contentService } from "@/lib/content/content.service";

import { Card } from "./card";

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
   
<section className="container-app w-full bg-black/90 ">
      <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4")}>
        {cells.map((cell, gridIdx) => {
          const hideOnTablet = gridIdx >= 15;
          const desktopOrder = calculateOrder(gridIdx, 4);

          return ( 
            <Card key={cell.id} cell={cell} hideOnTablet={hideOnTablet} desktopOrder={desktopOrder} />
          )
        })}
      </div>
    </section>
  );
};
