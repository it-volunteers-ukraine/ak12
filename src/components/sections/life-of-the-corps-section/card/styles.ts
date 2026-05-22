import { cn } from "@/utils"

interface IGetStyles {
  gridIdx: number;
  hideOnMobile: boolean;
  hideOnTablet: boolean;
  isPlaceholder: boolean;
  gridMobileOrder: number;
  gridDesktopOrder: number;
}

export const getStyles = ({
  gridIdx,
  hideOnMobile,
  hideOnTablet,
  isPlaceholder,
  gridMobileOrder,
  gridDesktopOrder,
}: IGetStyles) => ({
  textWrapperClassName: cn(
    "flex h-full w-full",
    gridIdx === 0 ? "md:items-start" : "items-center md:justify-center md:p-4",
  ),
  textStylesClassName: cn(
    "text-accent font-ermilov text-center uppercase",
    gridIdx === 0
      ? "md:text-start md:text-4xl md:leading-snug lg:text-[clamp(2.25rem,1.4rem+1.8vw,3rem)]"
      : "text-[24px] lg:text-[30px]",
  ),

  cardWrapperClassName: cn(
    "order-(--gridMobileOrder) max-w-100 mx-auto md:mx-0 w-full md:order-0 lg:order-(--gridDesktopOrder)",
    hideOnMobile && "hidden md:block",
    hideOnMobile && !hideOnTablet && "md:block",
    hideOnTablet && "md:hidden lg:block",
  ),
  cardWrapperStyle: {
    ["--gridMobileOrder" as string]: gridMobileOrder,
    ["--gridDesktopOrder" as string]: gridDesktopOrder,
  },
  buttonImageClassName: cn(
    "relative h-55 w-full transition-all duration-300",
    isPlaceholder ? "cursor-default" : "cursor-pointer lg:hover:z-20 lg:hover:scale-125",
  ),
});
