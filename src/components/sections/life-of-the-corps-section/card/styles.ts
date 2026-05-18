import { cn } from "@/utils"

interface IGetStyles {
  gridIdx: number;
  hideOnMobile: boolean;
  hideOnTablet: boolean;
  gridMobileOrder: number;
  gridDesktopOrder: number;
}

export const getStyles = ({ gridIdx, hideOnMobile, hideOnTablet, gridMobileOrder, gridDesktopOrder }: IGetStyles) => ({
    textWrapperClassName : cn(
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
        "order-(--gridMobileOrder) w-full md:order-0 lg:order-(--gridDesktopOrder)",
        hideOnMobile && "hidden md:block",
        hideOnMobile && !hideOnTablet && "md:block",
        hideOnTablet && "md:hidden lg:block",
      ),
      cardWrapperStyle :{ ["--gridMobileOrder" as string]: gridMobileOrder, ["--gridDesktopOrder" as string]: gridDesktopOrder }
})
