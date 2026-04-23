import { cn } from "@/utils";

export const getStyles = () => ({
  wrapper: (wrapperClassName?: string) => cn("mb-8 flex justify-end gap-6", wrapperClassName),
});
