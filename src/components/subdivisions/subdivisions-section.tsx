import { getTranslations } from "next-intl/server";
import { getSubdivisions } from "@/actions/subdivisions";
import { SubdivisionCard } from "./subdivision-card";
import { Locale } from "@/types";

interface SubdivisionsSectionProps {
  locale: Locale;
}

export const SubdivisionsSection = async ({ locale }: SubdivisionsSectionProps) => {
  const t = await getTranslations({ locale, namespace: "subdivisions" });
  const subdivisions = await getSubdivisions(locale);

  if (!subdivisions.length) {
    return null;
  }

  return (
    <section
      id="subdivisions"
      className="bg-surface-main overflow-hidden py-16 tablet:py-16 desktop:py-[103px]"
    >
      <div className="container-app">

        <h2 className="
          font-ermilov text-accent text-center font-bold
          text-[32px] leading-[125%]
          tablet:text-[40px] tablet:leading-[120%]
          desktop:text-[56px] desktop:leading-[114%]
        ">
          {t("title")}
        </h2>

        <p className="
          font-road-ui text-warm-gray text-center text-[14px] leading-[143%] font-normal
          mt-2 mb-4
          desktop:mb-16
        ">
          <span className="desktop:hidden">{t("subtitleMobile")}</span>
          <span className="hidden desktop:inline">{t("subtitle")}</span>
        </p>

        <ul className="
          m-0 list-none p-0
          flex flex-wrap justify-center
          gap-4
          desktop:gap-x-5 desktop:gap-y-6
          desktop-xl:gap-y-5
          mb-16 tablet:mb-20 desktop:mb-[142px]
        ">
          {subdivisions.map((subdivision) => (
            <li
              key={subdivision.id}
              className="
                flex
                w-full
                tablet:w-[calc(50%-8px)]
                laptop:w-[calc(33.333%-11px)]
                desktop:w-[413px]
              "
            >
              <SubdivisionCard subdivision={subdivision} />
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
};