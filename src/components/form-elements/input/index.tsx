import React from "react";

import { getStyles } from "./styles";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  className?: string;
};

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(({ invalid, className, ...props }, ref) => {
  const { inputStyle } = getStyles({ invalid, className });

  return <input {...props} ref={ref} className={inputStyle} />;
});

TextInput.displayName = "TextInput";
