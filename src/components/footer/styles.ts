export const getStyles = () => {
  const title = "text-soft-blush font-ermilov mb-2 tablet:mb-4";

  return {
    footer: "text-warm-gray bg-black pt-[44px] px-4 pb-7 tablet:px-10 tablet:pt-20 tablet:pb-9 desktop:p-20",
    container: "tablet:flex tablet:justify-between",
    containerTitle: "mb-10.5 tablet:max-w-[300px] tablet:w-full tablet:mb-0 tablet:mr-3 desktop:max-w-[365px]",
    title: `${title} text-[20px]`,
    subTitle: `${title} uppercase text-[20px]`,
    socialTitle: `${title} uppercase text-[18px] w-30 tablet:text-[20px] desktop:w-auto`,
    text: "text-[12px] tablet:text-[14px]",
    containerNavAndContact:
      "grid grid-cols-2 gap-4 tablet:flex tablet:justify-between tablet:max-w-[510px] tablet:w-full desktop:max-w-[740px]",
    link: "text-[12px] hover:text-soft-blush focus:text-soft-blush active:text-accent transition-colors duration-300 tablet:text-[14px]",
    menuList: "flex flex-col gap-2",
    labelContacts: "text-[12px] text-medium-gray uppercase tablet:text-[14px]",
    textContacts:
      "text-soft-blush font-ermilov text-[14px] hover:text-accent focus:text-accent active:text-accent transition-colors duration-300",
    containerCopyright:
      "flex flex-col gap-2 mt-7 border-t-[1px] border-dark-gray tablet:mt-[32px] tablet:pt-4 tablet:flex-row tablet:justify-between desktop:mt-10 desktop:py-4",
    copyrightText: "text-[12px]",
    socialLink:
      "text-light-gray h-full w-full hover:text-accent focus:text-accent active:text-accent transition-colors duration-300",
  };
};
