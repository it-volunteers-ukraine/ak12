import { cn } from "@/utils";

interface IStyles {
  className?: string;
  invalid: boolean | undefined;
}

export const getStyles = ({ className, invalid }: IStyles) => ({
  selectStyle: cn(
    "bg-background flex h-10 w-full cursor-pointer rounded-md border px-3 py-2 text-sm transition-all",
    "appearance-none focus-visible:ring-1 focus-visible:outline-none",
    invalid ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300 focus-visible:ring-black",
    className,
  ),
});
