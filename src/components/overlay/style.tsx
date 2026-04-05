import { cn } from "@/utils";

interface IGetStyles {
  isOpen: boolean;
}

export const getStyles = ({ isOpen }: IGetStyles) => ({
  overlay: cn("fixed inset-0 top-0 left-0 h-screen w-screen items-center justify-center  bg-black/40 z-998  ", {
    "animate-fade-in-opacity": isOpen,
    "animate-fade-out-opacity": !isOpen,
  }),
});
