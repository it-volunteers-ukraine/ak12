import { cn } from "@/utils";

export const getStyles = () => ({
  wrapper: (wrapperClassName?: string) => cn(" flex justify-end gap-6", wrapperClassName),
});
