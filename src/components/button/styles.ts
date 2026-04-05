import { cn } from "@/utils";

interface IStyles {
  className?: string;
  variant: "primary" | "secondary" | "outline" | "danger";
}

const variants = {
  primary: "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300",
  secondary: "bg-gray-200 text-black hover:bg-gray-300 disabled:bg-gray-100",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-black",
  danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
};

export const getStyles = ({ variant, className }: IStyles) => ({
  variantsButton: cn(
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none active:scale-95 disabled:pointer-events-none",
    variants[variant],
    className,
  ),
});
