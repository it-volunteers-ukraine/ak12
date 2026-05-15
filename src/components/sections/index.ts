export { HeroSection } from "./hero-section";

export { LifeOfTheCorpsSection } from "./life-of-the-corps-section";

{
  /*     <section className="container-app w-full bg-black/90">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4 grid-flow-dense">
        {content.content.gallery.slice(0, 9).map((item, idx) => {
          const count = idx >= 7;
const isReversed = idx % 2 !== 0;

          return (
            <div key={idx} className={cn("flex flex-col gap-5 ", count && 'hidden')}>
              {!count && (
                <div className={cn("flex h-55 w-full items-center justify-center p-4 max-h-55", !isReversed ? "order-1": "order-2")}>
                  <span className="text-white ">{item?.text || "No text"}</span>
                </div>
              )}
{!count && (
              <div className={cn(" flex h-55 w-full", !isReversed ? "order-2": "order-1")}>
                <Image src={item?.secureUrl || "hbnjk"} alt="" width={425} height={220} className="object-cover" />
              </div>
              )}
            </div>
          );
        })}
        {content.content.gallery.length >= 8 && (
      <div className="flex gap-5  flex-col ">
        {content.content.gallery.slice(7, 9).map((lastItem, lastIdx) => (
          <div key={lastIdx} className="relative flex h-55 w-full">
            <Image
              src={lastItem?.secureUrl || "hbnjk"}
              alt=""
              width={425}
              height={220}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    )}
      </div>
    </section> */
}
