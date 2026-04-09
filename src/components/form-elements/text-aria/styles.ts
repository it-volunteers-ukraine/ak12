import { cn } from "@/utils";

interface IStyles {
  className?: string;
  invalid: boolean | undefined;
}

export const getStyles = ({ className, invalid }: IStyles) => ({
  textareaStyle: cn(
    "transition-all focus-visible:ring-1 bg-background focus-visible:outline-none focus-visible:ring-1 flex h-10 w-full rounded-md border px-3 py-2 text-sm",
    invalid ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300",
    className,
  ),
});
