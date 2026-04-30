import Image from "next/image";

import { Locale } from "@/types";
import { SECTION_KEYS } from "@/constants";
import { heroContentSchema } from "@/schemas";
import { BlobButton } from "@/components/blobButton";
import { contentService } from "@/lib/content/content.service";

import { ArrowDown } from "../../../../public/icons";

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
    <section className="relative isolate overflow-hidden pt-18 text-white">
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

      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/55 to-black/35" />

      <div className="container-app flex flex-col justify-center py-15">
        <div>
          <h1 className="font-ermilov text-accent desktop:text-[116px] mb-4 text-5xl leading-tight font-bold uppercase md:text-7xl">
            {content.title}
          </h1>
          <h3 className="w-67 text-base text-white/90">{content.subtitle}</h3>

          <BlobButton className="mt-8 flex w-full" href={"#vacancy"} typeStyles="sub">
            <span className="font-ermilov flex items-center gap-1 text-[16px] text-black">
              {content.buttonTitle}
              <ArrowDown />
            </span>
          </BlobButton>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.features.map((item) => (
            <li key={`${item.value}_${item.label}`}>
              <p>{item.label}</p>
              <p>{item.value}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
