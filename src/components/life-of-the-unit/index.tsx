import { contentService } from "@/lib/content/content.service";
import { SECTION_KEYS } from "@/constants";
import { lifeOfUnitSchema } from "@/schemas/life-of-the-unit.schema";
import Image from "next/image";
import { logger } from "@/lib/logger";

const ImageSkeleton = () => (
  <div className="flex h-full w-full items-center justify-center bg-slate-200 animate-pulse">
    <div className="h-10 w-10 text-slate-400">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
);

export const LifeOfTheUnit = async ({ locale }: { locale: string }) => {
  if (!locale || locale.length !== 2 || locale.includes('.')) {
    return null;
  }

  try {
    const content = await contentService.get({
      locale: locale as any,
      section: SECTION_KEYS.LIFE_OF_UNIT,
      schema: lifeOfUnitSchema,
    });

    if (!content || !content.items) {
      return null;
    }

    return (
      <section className="container mx-auto py-16 px-4" id="life-of-the-unit">
        <h2 className="text-3xl font-bold mb-10 text-center uppercase tracking-tight">
          {content.mainTitle}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.items.map((item, index) => (
            <div 
              key={index} 
              className="group overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 transition-all hover:shadow-lg"
            >
              <div className="relative h-64 w-full bg-slate-100">
                {item.image && item.image.trim() !== "" ? (
                  <Image
                    width={500}
                    height={400}
                    src={item.image}
                    alt={item.alt || item.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <ImageSkeleton />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 uppercase">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  } catch (error) {
    logger.error("LifeOfTheUnit render error:", error);

    return null;
  }
};