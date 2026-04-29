"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ExternalLinkIcon } from "../../../../public/icons/index";

export function AdminViewSiteButton() {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
    >
      Переглянути сайт
      <ExternalLinkIcon className="h-6 w-6" />
    </Link>
  );
}
