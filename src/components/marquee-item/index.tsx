import { BbmIcon, HelicopterIcon, TanksIcon } from "../../../public/icons";

const ICONS = [HelicopterIcon, BbmIcon, TanksIcon];

export const MarqueeItem = ({ item, index }: { item: string; index: number }) => {
  const Icon = ICONS[index % ICONS.length];

  return (
    <div className="flex items-center gap-8 px-4">
      <Icon className="text-surface-main h-[50px] w-[50px]" />
      <span className="text-surface-main text-[24px] font-bold uppercase">{item}</span>
    </div>
  );
};
