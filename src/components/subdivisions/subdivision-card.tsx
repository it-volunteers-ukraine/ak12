"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Subdivision } from "@/types";

interface SubdivisionCardProps {
  subdivision: Subdivision;
}

const buildPlaceholder = (name: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480"><rect width="800" height="480" fill="#e2e8f0" /><rect x="24" y="24" width="752" height="432" rx="24" fill="#cbd5e1" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#334155" font-family="Arial, sans-serif" font-size="36">${name}</text></svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const SubdivisionCard = ({ subdivision }: SubdivisionCardProps) => {
  const t = useTranslations("subdivisions");
  const imageSrc = subdivision.imageUrl.startsWith("/images/subdivisions/")
    ? buildPlaceholder(subdivision.name)
    : subdivision.imageUrl;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full bg-slate-100">
        <Image
          src={imageSrc}
          alt={t("imageAlt", { name: subdivision.name })}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={imageSrc.startsWith("data:image/")}
          preload={subdivision.sortOrder <= 30}
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-xl font-bold text-slate-900">{subdivision.name}</h3>

        <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{subdivision.description}</p>

        {subdivision.siteUrl && (
          <div className="mt-auto border-t border-slate-100 pt-4">
            <a
              href={subdivision.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
            >
              {t("visitSite")}
              <svg
                className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </article>
  );
};
