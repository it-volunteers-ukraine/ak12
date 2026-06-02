import { cn } from "@/utils";

export const getTitleStyles = () => ({
  container:
    "desktop-xl:mb-18 desktop-xl:pt-40 tablet:px-10 tablet:pt-25 tablet:mb-10 desktop:pt-30 desktop:px-20 desktop:mb-14 mb-7 px-4 pt-16",
  title:
    "desktop:mb-4 font-ermilov text-accent tablet:text-[40px] tablet:mb-2 desktop:text-[56px] mb-4 text-center text-[32px]",
  subTitle: "text-warm-gray tablet:text-[18px] desktop:text-[20px] text-center text-[16px]",
});

const containerCardsChildrenBgImages = cn(
  "desktop:[&>*:nth-child(2)_.icon]:scale-x-[-1]",
  "desktop:[&>*:nth-child(3)_.icon]:scale-x-[-1]",
  "desktop:[&>*:nth-child(3)_.icon]:rotate-180",
  "desktop:[&>*:nth-child(4)_.icon]:rotate-180",
);

const containerCardsChildrenStep = cn(
  "desktop:[&>*:nth-child(2)_.step]:text-end",
  "desktop:[&>*:nth-child(4)_.step]:text-end",
);

export const getMobilizationStyles = () => ({
  container: "desktop:px-20 tablet:px-11",
  containerCards: cn(
    "tablet:gap-4 desktop:items-stretch desktop:gap-y-7 desktop:flex-row desktop:flex-wrap desktop:gap-x-7 flex flex-col items-center gap-7 ",
    containerCardsChildrenBgImages,
    containerCardsChildrenStep,
  ),
  containerContent:
    "tablet:w-max desktop:px-8 tablet:mx-auto bg-surface-main border-accent tablet:mt-16 tablet:text-center tablet:py-8 tablet:px-3.5 mt-8 border-b-4 p-4",
  primaryDescription: "text-warm-gray tablet:inline tablet:text-[20px] mb-0.5 text-center text-[16px]",
  accentedDescription: "text-accent tablet:inline mb-4 text-center text-[20px]",
  secondaryDescription: "text-warm-gray tablet:text-[20px] text-center text-[16px]",
});

export const getCardStyles = (isButton: boolean) => ({
  container: "tablet:w-171 desktop:w-[calc(50%-14px)] relative w-86 min-w-0",
  iconMobile: "tablet:hidden absolute inset-0 h-full w-full",
  iconTablet: "icon tablet:block absolute inset-0 hidden h-full w-full",
  containerContent: cn(
    "desktop-xl:pt-8 desktop-xl:pb-18 tablet:pt-6 desktop:pl-16 desktop:pr-13 desktop:pb-15 tablet:pl-6 tablet:pr-21.5 tablet:pb-15 relative z-1 px-8 pt-14 pb-9",
    isButton && "tablet:pb-21",
  ),
  step: "step desktop:text-[56px] desktop:mb-3 font-ermilov text-accent tablet:text-left tablet:text-[40px] tablet:mb-0 mb-2 text-right text-[32px]",
  title: "desktop:pl-3 font-ermilov text-accent tablet:text-[20px] mb-2 text-[18px] uppercase",
  subTitle:
    "desktop:pl-3 desktop:mb-3 text-warm-gray desktop:min-h-15 tablet:pb-4 tablet:text-[14px] tablet:border-b tablet:border-accent/8 tablet:mb-2 mb-2 text-[12px] font-medium",
  primaryDescription: "text-soft-blush tablet:text-[14px] text-[12px] font-medium",
  secondaryDescription: "text-soft-blush tablet:text-[14px] text-[12px] font-medium tablet:mt-2 desktop:mt-3",
  buttonContainer:
    "desktop-xl:w-[517px] desktop:w-[365px] desktop:mt-10 tablet:w-91.25 tablet:h-10 tablet:right-5.5 tablet:absolute desktop:relative desktop:right-0 mt-4",
});

export const getContractStyles = () => ({
  container: "desktop:px-20 tablet:px-10",
  subContainer:
    "desktop-xl:gap-[191px] desktop-xl:px-30 desktop-xl:max-w-[1760px] desktop:gap-[133px] desktop:py-28 desktop:px-12 desktop:max-w-[1280px] tablet:max-w-[978px] tablet:flex tablet:gap-4 tablet:py-10 tablet:mx-auto tablet:border-4 bg-surface-main border-stroke-green/24 border-t-4 border-b-4 px-4 pt-16 pb-14.5",
  title:
    "desktop:text-[32px] tablet:text-start tablet:text-[28px] font-ermilov text-soft-blush mb-4 text-center text-[32px]",
  subtitle:
    "desktop:mb-10 desktop:text-[20px] tablet:text-start tablet:text-[18px] tablet:mb-8 text-warm-gray mb-7 text-center text-[16px]",
  contactContainer: "desktop:mb-12 tablet:mb-8 tablet:text-start mb-7 text-center",
  contactStartText: "text-warm-gray inline text-[14px] font-medium",
  contactNumber: "tablet:text-[14px] text-accent font-extrabold",
  contactEndText: "text-warm-gray inline text-[14px] font-medium",
  contentContainer:
    "desktop:gap-4 tablet:mb-10 tablet:gap-2 tablet:flex-row tablet:flex-wrap tablet:gap-0 mb-7 flex flex-col gap-6",
  listContainer: "desktop:gap-4 tablet:flex tablet:gap-2 tablet:w-48",
  listSubContainer: "flex gap-2",
  icon: "text-accent h-4 w-4",
  itemTitle: "text-soft-blush mb-1 text-[14px] font-extrabold",
  itemSubtitle: "text-warm-gray text-[14px] font-medium",
  imgContainer:
    "desktop-xl:w-[654px] desktop-xl:h-65 desktop:w-101.5 tablet:shrink-0 tablet:h-max tablet:w-51 tablet:mt-0 relative mt-7",
  img: "w-full desktop-xl:h-[260px] h-auto desktop-xl:object-cover object-contain",
  imgPostContainer: "desktop:p-6 desktop-xl:pb-7 tablet:p-4 bg-surface-secondary p-6",
  titleContainer: "desktop-xl:h-[70px] desktop-xl:mb-0 tablet:mb-6 tablet:mb-3 mb-1 flex items-start gap-2.5",
  imgIcon: "desktop-xl:mb-auto desktop:w-4 tablet:w-3 text-soft-blush w-5 shrink-0 pt-2",
  imgTitle: "text-soft-blush text-[14px] font-extrabold text-wrap",
  imgSubtitle: "desktop-xl:h-[20px] text-space text-[12px]",
  cornerFrame: "h-11 w-11",
});

export const getTransferStyles = () => ({
  container: "desktop:px-20 tablet:px-10",
  subContainer:
    "desktop-xl:pr-[957px] desktop-xl:pb-[113px] desktop-xl:pl-[120px] desktop-xl:pt-[112px] desktop:pr-[579px] desktop:pb-[111px] desktop:pt-[152px] desktop:pl-[48px] overflow-hidden z-1 tablet:py-10 tablet:pl-4 tablet:pr-21.5 tablet:border-4 bg-surface-main border-stroke-green/24 relative border-t-4 border-b-4 px-4 pt-4.5 pb-13.75",
  title:
    "desktop:text-[32px] desktop:mb-4 tablet:uppercase tablet:mb-2 tablet:text-[28px] tablet:text-start font-ermilov text-soft-blush mb-4 text-center text-[32px]",
  subTitle:
    "desktop:mb-[40px] desktop:text-[20px]  tablet:text-[18px] tablet:text-start text-warm-gray mb-8 text-center text-[16px]",
  containerContent: "tablet:mb-12 mb-4 text-center tablet:text-start",
  startText: "tablet:text-start tablet:inline text-warm-gray mb-0.5 text-[14px] font-medium",
  link: "tablet:text-start tablet:inline text-accent mb-4 text-[14px] font-extrabold",
  endText: "tablet:text-start text-warm-gray text-[14px] font-medium",
  contentContainer: "desktop:mb-10 tablet:flex desktop:gap-4 tablet:gap-2 mb-3 tablet:mb-8",
  listContainer:
    "desktop:gap-1 tablet:flex-1 tablet:justify-between tablet:gap-1 tablet:flex-row flex flex-col z-1 relative",
  listSubContainer: "flex gap-2",
  icon: "text-accent h-4 w-4",
  containerItem: "flex gap-2",
  itemTitle: "text-soft-blush mb-1 text-[14px] font-extrabold",
  itemSubtitle: "text-warm-gray text-[14px] font-medium",
  img: "desktop-xl:top-0 desktop-xl:right-30 -z-1 desktop:bottom-0 desktop:right-0 desktop:w-[646] desktop:h-[646] tablet:w-[358px] tablet:h-[358px] tablet:-right-[47px] tablet:bottom-17 absolute right-0 bottom-24 h-53.5 w-51.25 object-cover",
});
