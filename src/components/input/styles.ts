import { cn } from "@/utils";

interface GetStylesProps {
  isError: boolean;
  isSuccess: boolean;
  classNameContainer?: string;
}

const BASE_PLACEHOLDER = "placeholder:text-darker-gray disabled:placeholder:text-text-disabled";
const BASE_LABEL = "text-soft-blush mb-2";

export const getStyles = ({ isError, isSuccess, classNameContainer }: GetStylesProps) => {
  const input = cn(
    BASE_PLACEHOLDER,
    "bg-surface-main text-soft-blush border border-accent/50 rounded-xs py-[14px] px-4 text-[16px] font-medium transition-colors",

    "hover:bg-olive-brown focus:bg-dark-khaki focus:border-accent outline-none",

    "disabled:bg-disabled disabled:border-accent/8 disabled:text-text-disabled",

    "autofill:[-webkit-text-fill-color:#f9efec]",
    "autofill:shadow-[inset_0_0_0px_1000px_#0d0d0d]",
    "autofill:[caret-color:#f9efec]",
    "hover:autofill:shadow-[inset_0_0_0px_1000px_#282720]",
    "focus:autofill:shadow-[inset_0_0_0px_1000px_#1f1d16]",

    isSuccess && "border-accent",
    isError && "border-error focus:border-error",
  );

  return {
    container: cn("flex flex-col relative w-full", classNameContainer),
    label: BASE_LABEL + " text-[14px]",
    input,
    textarea: input + " resize-none h-32",
    radioLabelGroup: BASE_LABEL + " text-[20px]/7",
    radioContainer: "flex items-center gap-6",
    radioLabel: "text-soft-blush text-[16px] flex items-center gap-1 cursor-pointer",
    radioBigCircle:
      "border-darker-gray peer-checked:!border-soft-blush peer-hover:border-soft-blush/50 peer-focus:border-soft-blush/50 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors peer-hover:[&>div]:opacity-50 peer-focus:[&>div]:opacity-50 peer-checked:[&>div]:!opacity-100",
    radioSmallCircle: "bg-accent h-3 w-3 opacity-0 rounded-full transition-transform",
    radioInput: "peer sr-only",
    errorText: "text-error absolute top-full left-4 text-xs",
  };
};
