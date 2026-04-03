import { contentService } from "@/lib/content/content.service";
import { SECTION_KEYS } from "@/constants";
import { lifeOfUnitSchema } from "@/schemas/life-of-the-unit.schema";

export const LifeOfTheUnit = async ({ locale }: { locale: string }) => {
    const content = await contentService.get({
    locale: locale as any, 
    section: SECTION_KEYS.LIFE_OF_UNIT,
    schema: lifeOfUnitSchema
  });

  if (!content) {return null;}

 return (
    <section>
      <h2>{content.mainTitle}</h2>
      <div>
        {content.items.map((item, index) => (
          <div key={index}>
            <h3>{item.title}</h3>
            <img src={item.image} alt={item.alt || ""} />
          </div>
        ))}
      </div>
    </section>
  );
};

