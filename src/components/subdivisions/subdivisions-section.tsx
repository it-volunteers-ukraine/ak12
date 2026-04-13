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
      className="bg-surface-main flex flex-col items-center overflow-hidden px-[80px] py-[103px]"
    >
      <h2 className="font-road-ui text-accent mb-4 text-center text-[56px] leading-[114%] font-bold">{t("title")}</h2>

      <p className="font-road-ui text-warm-gray mb-16 max-w-[800px] text-center text-[14px] leading-[143%] font-normal">
        {t("subtitle")}
      </p>

      <ul className="m-0 mb-[142px] flex max-w-[1280px] list-none flex-wrap justify-center gap-x-5 gap-y-6 p-0">
        {subdivisions.map((subdivision) => (
          <li key={subdivision.id} className="flex-shrink-0">
            <SubdivisionCard subdivision={subdivision} />
          </li>
        ))}
      </ul>
    </section>
  );
};
