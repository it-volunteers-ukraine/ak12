import { cn } from "@/utils";

interface IGetStyles {
  isOpen: boolean;
  classNameOverlay?: string;
}

export const getStyles = ({ isOpen, classNameOverlay }: IGetStyles) => ({
  overlay: cn(
    "fixed top-0 left-0 z-[998] flex h-screen w-screen items-center justify-center bg-black/40",
    classNameOverlay,
    {
      "animate-fade-in-opacity": isOpen,
      "animate-fade-out-opacity": !isOpen,
    },
  ),
});
