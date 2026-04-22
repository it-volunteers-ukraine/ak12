"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Subdivision } from "@/types";

interface SubdivisionCardProps {
  subdivision: Subdivision;
}

export const SubdivisionCard = ({ subdivision }: SubdivisionCardProps) => {
  const t = useTranslations("subdivisions");

  return (
  
<article className="group border-stroke-green bg-card-bg relative box-border flex h-[450px] w-[413px] cursor-pointer flex-col border-2 p-[24px] pb-[32px] transition-all duration-300 group-hover:border-transparent">
      {/* ── DEFAULT STATE */}
      <div className="border-dark-gray bg-surface-main relative flex h-[303px] w-[365px] flex-shrink-0 items-center justify-center overflow-hidden border">
        {subdivision.imageUrl ? (
          <Image
            src={subdivision.imageUrl.secureUrl}
            alt={t("imageAlt", { name: subdivision.name })}
            width={363}
            height={269}
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

      <div className="mt-4 flex h-full flex-col items-center justify-start">
        <h3 className="font-ermilov text-accent mb-1 text-center text-[20px] leading-[140%] font-bold uppercase">
          {subdivision.name}
        </h3>

        <div className="flex flex-col gap-1">
          <p className="font-road-ui text-warm-gray text-center text-[12px] leading-[125%] font-normal whitespace-pre-line">
            {subdivision.description.replaceAll(". ", ".\n")}
          </p>
        </div>
      </div>

      {/* ── HOVER STATE  */}
      <div className="absolute inset-0 flex flex-col p-[24px] pb-[32px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="relative h-[394px] w-[366px] flex-shrink-0 self-center overflow-hidden">
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
            className="absolute inset-0 flex flex-col justify-end p-[16px] pb-4"
            style={{
              background:
                "linear-gradient(180deg, rgba(59, 63, 50, 0) 0%, rgba(13, 13, 13, 0.7) 50%, rgba(0, 0, 0, 0.8) 100%)",
            }}
          >
            <h3 className="font-ermilov text-accent mb-1 text-center text-[20px] leading-[140%] font-bold uppercase">
              {subdivision.hoverName ?? subdivision.name}
            </h3>

            <p className="font-road-ui text-warm-gray mb-1 line-clamp-4 text-center text-[12px] leading-[125%] font-normal whitespace-pre-line">
              {(subdivision.hoverDescription ?? subdivision.description).replaceAll(". ", ".\n")}
            </p>

            {/* Відображаємо посилання лише якщо воно існує в БД */}
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
    </article>
  );
};
