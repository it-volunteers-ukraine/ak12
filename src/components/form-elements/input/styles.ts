import { cn } from "@/utils";

interface IStyles {
  className?: string;
  invalid: boolean | undefined;
}

export const getStyles = ({ className, invalid }: IStyles) => ({
  inputStyle: cn(
    "transition-all focus-visible:ring-1 w-full bg-background flex h-10 w-full rounded-md border px-3 py-3 text-[16px] text-gray-700/90",
    invalid ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300",
    className,
  ),
});
