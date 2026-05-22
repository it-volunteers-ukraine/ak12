"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Subdivision } from "@/types";
import InfoCircleIcon from "../../../public/icons/info-circle.svg";
import TimesIcon from "../../../public/icons/times.svg";

interface SubdivisionCardProps {
  subdivision: Subdivision;
}

export const SubdivisionCard = ({ subdivision }: SubdivisionCardProps) => {
  const t = useTranslations("subdivisions");
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <article className="
      group
      relative box-border flex flex-col cursor-pointer
      border-2 border-stroke-green bg-card-bg
      overflow-visible
      transition-all duration-300
      hover:border-transparent

      w-full p-4 pb-6
      desktop:h-[450px] desktop:p-6 desktop:pb-8
    ">

      {/* ── DEFAULT STATE ───────────────────────────────────────── */}

      {/* Image block */}
      <div className="
        relative flex-shrink-0 overflow-hidden
        border border-dark-gray bg-surface-main
        flex items-center justify-center
        w-full aspect-[4/3]
        desktop:aspect-auto desktop:w-auto desktop:h-[303px]
      ">
        {subdivision.imageUrl ? (
          <Image
            src={subdivision.imageUrl.secureUrl}
            alt={t("imageAlt", { name: subdivision.name })}
            fill
            className="object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect width="80" height="80" rx="8" fill="#2a2a2a" />
              <path d="M20 56L32 38L40 48L52 32L60 56H20Z" fill="#444" />
              <circle cx="30" cy="30" r="6" fill="#444" />
            </svg>
          </div>
        )}
      </div>

      {/* Text below image */}
      <div className="mt-4 flex h-full flex-col items-center justify-start">
        <h3 className="font-ermilov text-accent mb-1 text-center text-[18px] leading-[140%] font-bold uppercase desktop:text-[20px]">
          {subdivision.name}
        </h3>
        <div className="flex flex-col gap-1">
          <p className="font-road-ui text-warm-gray text-center text-[12px] leading-[125%] font-normal whitespace-pre-line">
            {subdivision.description.replaceAll(". ", ".\n")}
          </p>
        </div>
      </div>

      {/* ⓘ Info button — hidden when overlay is open */}
      {!infoOpen && (
        <button
          type="button"
          aria-label={t("showInfo")}
          onClick={(e) => {
            e.stopPropagation();
            setInfoOpen(true);
          }}
          style={{ top: "calc(1rem + 10px)", right: "calc(1rem + 10px)" }}
          className="
            desktop:hidden
            absolute z-10
            flex items-center justify-center
            w-7 h-7 rounded-full
            bg-black/50 hover:bg-black/70
            transition-colors duration-200
          "
        >
          <InfoCircleIcon width={20} height={20} />
        </button>
      )}

      {/* ── DESKTOP HOVER STATE (1440px+) ─────────────────────────── */}
      <div className="hidden desktop:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="
          flex flex-col w-full h-full
          p-6 pb-8
          opacity-0 transition-opacity duration-300
          group-hover:opacity-100 group-hover:pointer-events-auto
        ">
          <div className="relative flex-1 w-full overflow-hidden">
            {subdivision.hoverImageUrl ? (
              <Image
                src={subdivision.hoverImageUrl.secureUrl}
                alt={t("hoverImageAlt", { name: subdivision.hoverName ?? subdivision.name })}
                fill
                className="object-cover object-bottom"
              />
            ) : (
              <div className="bg-surface-secondary h-full w-full" />
            )}

            <div
              className="absolute inset-0 flex flex-col justify-end p-4"
              style={{
                background:
                  "linear-gradient(180deg, rgba(59,63,50,0) 0%, rgba(13,13,13,0.7) 50%, rgba(0,0,0,0.8) 100%)",
              }}
            >
              <h3 className="font-ermilov text-accent mb-1 text-center text-[20px] leading-[140%] font-bold uppercase">
                {subdivision.hoverName ?? subdivision.name}
              </h3>
              <p className="font-road-ui text-warm-gray mb-1 line-clamp-4 text-center text-[12px] leading-[125%] font-normal whitespace-pre-line">
                {(subdivision.hoverDescription ?? subdivision.description).replaceAll(". ", ".\n")}
              </p>
              {subdivision.siteUrl && (
                <a
                  href={subdivision.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-road-ui text-accent decoration-skip-ink-none mt-1 block text-center text-[12px] leading-[125%] font-normal underline"
                >
                  {t("visitSite")}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE / TABLET INFO OVERLAY ──────────────────────────── */}
      {infoOpen && (
        <div className="desktop:hidden absolute inset-0 overflow-hidden z-20">
          <div className="relative flex flex-col w-full h-full p-4">
            <div className="relative flex-1 w-full overflow-hidden">
              {subdivision.hoverImageUrl ? (
                <Image
                  src={subdivision.hoverImageUrl.secureUrl}
                  alt={t("hoverImageAlt", { name: subdivision.hoverName ?? subdivision.name })}
                  fill
                  className="object-cover object-bottom"
                />
              ) : (
                <div className="absolute inset-0 bg-surface-secondary" />
              )}

              <div
                className="absolute inset-0 flex flex-col justify-end p-4"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(59,63,50,0) 0%, rgba(13,13,13,0.7) 40%, rgba(0,0,0,0.9) 100%)",
                }}
              >
                <h3 className="font-ermilov text-accent mb-1 text-center text-[18px] leading-[140%] font-bold uppercase">
                  {subdivision.hoverName ?? subdivision.name}
                </h3>
                <p className="font-road-ui text-warm-gray mb-2 line-clamp-6 text-center text-[12px] leading-[125%] font-normal whitespace-pre-line">
                  {(subdivision.hoverDescription ?? subdivision.description).replaceAll(". ", ".\n")}
                </p>
                {subdivision.siteUrl && (
                  <a
                    href={subdivision.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-road-ui text-accent decoration-skip-ink-none mb-1 block text-center text-[12px] leading-[125%] font-normal underline"
                  >
                    {t("visitSite")}
                  </a>
                )}
              </div>
            </div>

            {/* × Close button — inside overflow-hidden wrapper but z-30 */}
            <button
              type="button"
              aria-label={t("closeInfo")}
              onClick={(e) => {
                e.stopPropagation();
                setInfoOpen(false);
              }}
              className="
                absolute top-2 right-2 z-30
                flex items-center justify-center
                w-8 h-8 rounded-full
                bg-black/50 hover:bg-black/70
                transition-colors duration-200
              "
            >
              <TimesIcon width={16} height={16} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
};