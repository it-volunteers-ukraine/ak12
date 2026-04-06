import React from "react";

import { Loader } from "@/assets/icons";

import { getStyles } from "./styles";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, type = "button", ...props }, ref) => {
    const { variantsButton } = getStyles({ variant, className });

    return (
      <button ref={ref} type={type} disabled={isLoading || props.disabled} className={variantsButton} {...props}>
        {isLoading ? <Loader className="size-6" /> : children}
      </button>
    );
  },
);

Button.displayName = "Button";
