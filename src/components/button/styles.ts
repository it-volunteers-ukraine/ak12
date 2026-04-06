import { cn } from "@/utils";

interface IStyles {
  className?: string;
  variant: "primary" | "secondary" | "danger" | "outline";
}

const variants = {
  danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
  secondary: "bg-gray-200 text-black hover:bg-gray-300 disabled:bg-gray-100",
  primary: "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300",
  outline:
    "border border-gray-300 text-gray-500 bg-gray-100 hover:bg-gray-200 disabled:border-gray-400 disabled:text-gray-300",
};

export const getStyles = ({ variant, className }: IStyles) => ({
  variantsButton: cn(
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all  active:scale-95 disabled:pointer-events-none",
    variants[variant],
    className,
  ),
});
