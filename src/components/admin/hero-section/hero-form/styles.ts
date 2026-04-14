import { cn } from "@/utils";

export const getStyles = () => ({
  textContentWrapper: "flex-1 flex-col rounded-2xl border border-gray-300 bg-[#F8F9FA]/80 px-6 pt-10 pb-9",
  iconWrapper: (iconWrapperClassName?: string) =>
    cn("flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ", iconWrapperClassName),
});
