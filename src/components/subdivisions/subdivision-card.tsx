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
    <article className="group border-stroke-green bg-card-bg desktop:h-[450px] desktop:p-6 desktop:pb-8 relative box-border flex w-full cursor-pointer flex-col overflow-visible border-2 p-4 pb-6 transition-all duration-300 hover:border-transparent">
      {/* ── DEFAULT STATE ───────────────────────────────────────── */}

      {/* Image block */}
      <div className="border-dark-gray bg-surface-main desktop:aspect-auto desktop:w-auto desktop:h-[303px] relative flex aspect-[4/3] w-full flex-shrink-0 items-center justify-center overflow-hidden border">
        {subdivision.imageUrl ? (
          <Image
            src={subdivision.imageUrl.secureUrl}
            alt={t("imageAlt", { name: subdivision.name })}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
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
        <h3 className="font-ermilov text-accent desktop:text-[20px] mb-1 text-center text-[18px] leading-[140%] font-bold uppercase">
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
          className="desktop:hidden absolute z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 transition-colors duration-200 hover:bg-black/70"
        >
          <InfoCircleIcon width={20} height={20} />
        </button>
      )}

      {/* ── DESKTOP HOVER STATE (1440px+) ─────────────────────────── */}
      <div className="desktop:block pointer-events-none absolute inset-0 hidden overflow-hidden">
        <div className="flex h-full w-full flex-col p-6 pb-8 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
          <div className="relative w-full flex-1 overflow-hidden">
            {subdivision.hoverImageUrl ? (
              <Image
                src={subdivision.hoverImageUrl.secureUrl}
                alt={t("hoverImageAlt", { name: subdivision.hoverName ?? subdivision.name })}
                fill
                sizes="33vw"
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
        <div className="desktop:hidden absolute inset-0 z-20 overflow-hidden">
          <div className="relative flex h-full w-full flex-col p-4">
            <div className="relative w-full flex-1 overflow-hidden">
              {subdivision.hoverImageUrl ? (
                <Image
                  src={subdivision.hoverImageUrl.secureUrl}
                  alt={t("hoverImageAlt", { name: subdivision.hoverName ?? subdivision.name })}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-bottom"
                />
              ) : (
                <div className="bg-surface-secondary absolute inset-0" />
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
              className="absolute top-2 right-2 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 transition-colors duration-200 hover:bg-black/70"
            >
              <TimesIcon width={16} height={16} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
