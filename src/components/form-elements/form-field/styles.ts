import { FieldError } from "react-hook-form";

import { cn } from "@/utils";

interface IStyles {
  className?: string;
  error: FieldError | undefined;
}

export const getStyles = ({ error, className }: IStyles) => ({
  labelStyle: cn(
    "text-sm leading-none w-fit font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    error && "text-red-500",
  ),
  wrapperStyle: cn("flex w-full flex-col gap-2", className),
  errorStyle: "text-[0.8rem] font-medium text-red-500",
});
