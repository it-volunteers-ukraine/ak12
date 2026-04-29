import { contentService } from "@/lib/content/content.service";
import { SECTION_KEYS } from "@/constants";
import { lifeOfUnitSchema } from "@/schemas/life-of-the-unit.schema";
import Image from "next/image";
import { logger } from "@/lib/logger";

const ImageSkeleton = () => (
  <div className="flex h-full w-full animate-pulse items-center justify-center bg-slate-200">
    <div className="h-10 w-10 text-slate-400">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  </div>
);

export const LifeOfTheUnit = async ({ locale }: { locale: string }) => {
  if (!locale || locale.length !== 2 || locale.includes(".")) {
    return null;
  }

  const validLocale = locale === "en" ? "en" : "uk";

  try {
    const content = await contentService.get({
      locale: validLocale,
      section: SECTION_KEYS.LIFE_OF_UNIT,
      schema: lifeOfUnitSchema,
    });

    if (!content || !content.items) {
      return null;
    }

    return (
      <section className="container mx-auto px-4 py-16" id="life-corps">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight uppercase">{content.mainTitle}</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-lg"
            >
              <div className="relative h-64 w-full bg-slate-100">
                {item.image && item.image.trim() !== "" ? (
                  <Image
                    width={500}
                    height={400}
                    src={item.image}
                    alt={item.alt || item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <ImageSkeleton />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 uppercase">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  } catch (error) {
    logger.error({ error }, "LifeOfTheUnit rendering failed");

    return null;
  }
};
