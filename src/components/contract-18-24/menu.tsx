import { cn } from "@/utils";
import { BlockListItem } from ".";

interface MenuProps {
  activeBlock: BlockListItem;
  blockList: {
    label: string;
    value: BlockListItem;
  }[];
  onChangeBlock: (block: BlockListItem) => void;
}

export const Menu = ({ activeBlock, blockList, onChangeBlock }: MenuProps) => {
  return (
    <div
      role="tablist"
      aria-label="Навігація по розділу приєднання"
      className="desktop:mb-18 tablet:mb-14 tablet:flex-row tablet:justify-center tablet:gap-5 mb-6 flex flex-col items-center"
    >
      {blockList.map((block) => {
        const isActive = activeBlock === block.value;

        return (
          <button
            role="tab"
            key={block.value}
            aria-selected={isActive}
            onClick={() => onChangeBlock(block.value)}
            className={cn(
              "tablet:text-[20px] desktop:text-[24px] h-11 px-2.5 text-[16px] font-bold",
              activeBlock === block.value ? "border-accent text-accent border-b" : "text-warm-gray",
            )}
          >
            {block.label}
          </button>
        );
      })}
    </div>
  );
};
