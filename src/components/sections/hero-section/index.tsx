import Link from "next/link";
import Image from "next/image";

import { Locale } from "@/types";
import { SECTION_KEYS } from "@/constants";
import { heroContentSchema } from "@/schemas";
import { contentService } from "@/lib/content/content.service";

export const HeroSection = async ({ locale }: { locale: Locale }) => {
  const content = await contentService.get({
    locale,
    schema: heroContentSchema,
    section: SECTION_KEYS.HERO,
  });

  if (!content) {
    return null;
  }

  return (
    <section className="relative isolate min-h-[680px] overflow-hidden pt-18 text-white">
      {content.backgroundImage?.secureUrl && (
        <Image
          fill
          priority
          sizes="100vw"
          src={content.backgroundImage.secureUrl}
          alt={content.title}
          className="-z-20 object-cover"
        />
      )}

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/55 to-black/35" />

      <div className="container flex min-h-[680px] flex-col justify-center py-16">
        <div className="max-w-[760px]">
          <h1 className="font-ermilov text-accent text-4xl leading-tight font-bold uppercase md:text-6xl">
            {content.title}
          </h1>

          <p className="mt-6 max-w-[620px] text-base leading-relaxed text-white/90 md:text-xl">{content.subtitle}</p>

          <Link
            href="#vacancy"
            className="bg-accent mt-10 inline-flex rounded-full px-8 py-4 text-sm font-semibold text-black uppercase transition hover:opacity-90"
          >
            {content.buttonTitle}
          </Link>
        </div>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li className="rounded-2xl border border-white/20 bg-black/35 p-5 backdrop-blur-sm">
            <p className="text-accent text-xl font-semibold md:text-3xl">{content.hiringChance.value}</p>
            <p className="mt-2 text-sm text-white/85 uppercase">{content.hiringChance.title}</p>
          </li>
          <li className="rounded-2xl border border-white/20 bg-black/35 p-5 backdrop-blur-sm">
            <p className="text-accent text-xl font-semibold md:text-3xl">{content.majors.value}</p>
            <p className="mt-2 text-sm text-white/85 uppercase">{content.majors.title}</p>
          </li>
          <li className="rounded-2xl border border-white/20 bg-black/35 p-5 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
            <p className="text-accent text-xl font-semibold md:text-3xl">{content.support.value}</p>
            <p className="mt-2 text-sm text-white/85 uppercase">{content.support.title}</p>
          </li>
        </ul>
      </div>
    </section>
  );
};
