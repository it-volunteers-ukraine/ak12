"use client";

import { useRef } from "react";

import { useTranslations } from "next-intl";

import { Subdivision } from "@/types";
import { useTopFromViewportMinusContent } from "@/hooks/useTopFromViewportMinusContent";

import { SubdivisionCard } from "./subdivision-card";

export const SubdivisionsSection = ({ content }: { content: Subdivision[] | null }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const top = useTopFromViewportMinusContent(sectionRef);

  const t = useTranslations("subdivisions");

  if (!content?.length) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="subdivisions"
      className="bg-surface-main sticky overflow-hidden"
      style={{ zIndex: 4, top: `${top}px` }}
    >
      <div className="container-app">
        <h2 className="font-ermilov text-accent tablet:text-[40px] tablet:leading-[120%] desktop:text-[56px] desktop:leading-[114%] text-center text-[32px] leading-[125%] font-bold">
          {t("title")}
        </h2>

        <p className="font-road-ui text-warm-gray desktop:mb-16 mt-2 mb-4 text-center text-[14px] leading-[143%] font-normal">
          <span className="desktop:hidden">{t("subtitleMobile")}</span>
          <span className="desktop:inline hidden">{t("subtitle")}</span>
        </p>

        <ul className="desktop:gap-x-5 desktop:gap-y-6 desktop-xl:gap-y-5 m-0 flex list-none flex-wrap justify-center gap-4 p-0">
          {content?.map((subdivision) => (
            <li
              key={subdivision.id}
              className="tablet:w-[calc(50%-8px)] laptop:w-[calc(33.333%-11px)] desktop:w-[413px] flex w-full"
            >
              <SubdivisionCard subdivision={subdivision} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
