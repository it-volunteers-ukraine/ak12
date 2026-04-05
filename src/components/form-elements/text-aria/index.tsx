import React from "react";

import { getStyles } from "./styles";

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
  className?: string;
};

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ invalid, className, ...props }, ref) => {
    const { textareaStyle } = getStyles({ invalid, className });

    return <textarea ref={ref} {...props} className={textareaStyle} />;
  },
);

TextArea.displayName = "TextArea";
