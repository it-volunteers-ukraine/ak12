export const getStyles = () => {
  const title = "text-soft-blush font-ermilov mb-4 text-[20px]";

  return {
    footer: "text-warm-gray bg-black px-10 py-12",
    container: "grid grid-cols-4 gap-12",
    title,
    subTitle: `${title} uppercase`,
    text: "text-[14px]",
    menuList: "flex flex-col gap-2",
    labelContacts: "text-[12px] text-medium-gray uppercase",
    textContacts: "text-soft-blush font-ermilov text-[14px]",
    containerCopyright: "flex justify-between items-center mt-12 border-t-[1px] border-dark-gray pt-4",
  };
};
