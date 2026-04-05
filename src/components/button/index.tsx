import React from "react";

import { getStyles } from "./styles";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
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
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Завантаження...
          </div>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
