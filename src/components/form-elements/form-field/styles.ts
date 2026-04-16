import { FieldError } from "react-hook-form";

import { cn } from "@/utils";

interface IStyles {
  className?: string;
  error: FieldError | undefined;
  wrapperComponentClassName?: string;
}

export const getStyles = ({ error, wrapperComponentClassName, className }: IStyles) => ({
  wrapper: cn("flex w-full flex-col gap-2", className),
  labelStyle: cn(
    "text-[14px] text-gray-500 leading-none w-fit font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    error && "text-red-500",
  ),
  wrapperStyle: cn("flex w-full flex-col gap-2", wrapperComponentClassName),
  errorStyle: "text-[0.8rem] font-medium text-red-500",
});
