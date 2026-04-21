import { cn } from "@/utils";

export const getStyles = () => ({
  wrapper: (wrapperClassName?: string) => cn("flex w-full flex-col gap-2", wrapperClassName),
  iconWrapper: (iconWrapperClassName?: string) =>
    cn("flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ", iconWrapperClassName),
});
