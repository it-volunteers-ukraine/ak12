export const getStyles = () => {
  const title = "text-soft-blush font-ermilov mb-4 text-[20px]";

  return {
    footer: "text-warm-gray bg-black p-20",
    container: "grid grid-cols-4 gap-12",
    title,
    subTitle: `${title} uppercase`,
    text: "text-[14px]",
    link: "text-[14px] hover:text-soft-blush focus:text-soft-blush active:text-accent transition-colors duration-300",
    menuList: "flex flex-col gap-2",
    labelContacts: "text-[12px] text-medium-gray uppercase",
    textContacts:
      "text-soft-blush font-ermilov text-[14px] hover:text-accent focus:text-accent active:text-accent transition-colors duration-300",
    containerCopyright: "flex justify-between items-center mt-10 border-t-[1px] border-dark-gray pt-4",
    socialLink:
      "text-light-gray h-full w-full hover:text-accent focus:text-accent active:text-accent transition-colors duration-300",
  };
};
