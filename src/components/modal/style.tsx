import { cn } from "@/utils";

interface IGetStyles {
  isOpen: boolean;
}

export const getStyles = ({ isOpen }: IGetStyles) => ({
  overlay: cn("fixed  top-0 left-0 h-screen w-screen items-center justify-center  bg-black/40 z-998 flex ", {
    "animate-fade-in-opacity ": isOpen,
    "animate-fade-out-opacity  ": !isOpen,
  }),
});
