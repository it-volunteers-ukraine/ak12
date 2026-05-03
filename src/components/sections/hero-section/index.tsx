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
    <section className="desktop-xl:max-w-480 desktop-xl:mx-auto relative isolate overflow-hidden pt-18 text-white">
      {content.backgroundImage?.secureUrl && (
        <Image
          fill
          priority
          sizes="100vw"
          alt={content.title}
          className="-z-20 object-cover"
          src={content.backgroundImage.secureUrl}
        />
      )}

      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/80 via-black/35 to-black/25" />

      <div className="container-app flex flex-col justify-center py-15">
        <div className="mb-24 md:mb-8 lg:mb-10">
          <h1 className="font-ermilov desktop:text-[116px] mb-4 max-w-121 text-5xl leading-tight font-bold uppercase md:text-7xl lg:max-w-200">
            {content.title}
          </h1>
          <h3 className="w-67 text-base text-white/90">{content.subtitle}</h3>
        </div>
        <div className="order-2 mx-auto mb-8 w-full max-w-90 md:order-3 md:mx-0 md:mb-0 md:self-end">
          <ul className="md:divide-accent/50 flex w-full md:justify-between md:gap-4 md:divide-x">
            {content.features.map((item) => (
              <li
                key={`${item.value}_${item.label}`}
                className="flex flex-1 flex-col items-center gap-2 whitespace-nowrap md:pr-4"
              >
                <span className="text-accent">{item.value}</span>
                <span className="text-[12px]">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <BlobButton
          typeStyles="sub"
          href={"#vacancy"}
          openInNewTab={false}
          className="order-3 flex h-15 w-full max-w-90 self-center md:order-2 md:mt-0 md:mb-23 md:w-70 md:max-w-none md:self-start md:py-3 xl:mb-36"
        >
          <span className="font-ermilov flex items-center gap-1 py-3 text-[20px] text-black md:py-0">
            {content.buttonTitle}
            <ArrowDown />
          </span>
        </BlobButton>
      </div>
    </section>
  );
};
