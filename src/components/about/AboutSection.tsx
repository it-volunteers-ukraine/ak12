import Image from "next/image";
import { Locale } from "@/types";
import { SECTION_KEYS } from "@/constants";
import { aboutUsSchema } from "@/schemas/about-us.schema";
import { contentService } from "@/lib/content/content.service";
import { Logo } from "../../../public/images";
import Ak12RightSection from "../../../public/icons/ak12-right-section.svg";

interface AboutSectionProps {
  locale: Locale;
}

export const AboutSection = async ({ locale }: AboutSectionProps) => {
  const data = await contentService.get({
    locale,
    schema: aboutUsSchema,
    section: SECTION_KEYS.ABOUT,
  });

  if (!data) {
    return null;
  }

  const { mainTitle, description } = data;

  const cornerClass = "pointer-events-none absolute border-accent opacity-50 w-9 h-9 border-2 tablet:w-16 tablet:h-16";

  return (
    <section
      id="about"
      className="relative clear-both block w-full overflow-hidden"
      style={{ backgroundImage: `var(--background-image-section)` }}
    >
      <div className="container-app relative flex flex-col justify-between">
        {/* ================= HEADER TOP (CORNERS) ================= */}
        <div className="tablet:h-16 relative h-9 w-full">
          <span className={`${cornerClass} top-0 left-0 border-r-0 border-b-0`} />
          <span className={`${cornerClass} top-0 right-0 border-b-0 border-l-0`} />
        </div>

        {/* ================= MAIN CONTENT CONTAINER ================= */}
        <div className="tablet:py-10 desktop:py-14 flex w-full flex-col py-6">
          <div className="tablet:gap-[22px] tablet:mb-10 desktop:mb-14 mb-6 flex w-full flex-nowrap items-center gap-4">
            <Image
              src={Logo}
              alt="Герб 12-го Армійського корпусу"
              className="tablet:h-12 tablet:w-12 desktop:h-14 desktop:w-14 h-10 w-10 shrink-0"
            />
            <h2 className="font-ermilov text-accent tablet:text-[40px] tablet:leading-[120%] desktop:text-[56px] desktop:leading-[114%] desktop:text-primary-yellow-100 text-left text-[28px] leading-[120%] font-bold whitespace-nowrap">
              {mainTitle}
            </h2>
          </div>
          <div className="tablet:flex-row tablet:justify-between tablet:items-center tablet:gap-4 desktop:gap-6 desktop-xl:gap-[80px] flex w-full flex-col gap-8">
            <div className="tablet:w-[336px] tablet:shrink-0 desktop:w-[738px] desktop-xl:w-[870px] w-full">
              <div className="bg-surface-main border-accent tablet:p-8 tablet:h-[324px] desktop:p-8 desktop:h-[204px] desktop-xl:p-8 desktop-xl:h-[176px] w-full rounded-[2px] border-l-4 p-5">
                <p className="font-road-ui text-soft-blush tablet:text-[18px] tablet:leading-[144%] desktop:text-[20px] desktop:leading-[140%] text-left text-base font-normal">
                  {description}
                </p>
              </div>
            </div>
            <div
              className="tablet:block tablet:shrink-0 tablet:w-[280px] tablet:h-[220px] desktop:w-[446px] desktop:h-[334px] desktop-xl:w-[572px] desktop-xl:h-[428px] pointer-events-none relative hidden self-center select-none"
              aria-hidden="true"
            >
              <Ak12RightSection className="h-full w-full" />
            </div>
          </div>
        </div>

        {/* ================= HEADER BOTTOM (CORNERS) ================= */}
        <div className="tablet:h-16 relative h-9 w-full">
          <span className={`${cornerClass} bottom-0 left-0 border-t-0 border-r-0`} />
          <span className={`${cornerClass} right-0 bottom-0 border-t-0 border-l-0`} />
        </div>
      </div>
    </section>
  );
};
