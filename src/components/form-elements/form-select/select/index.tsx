import React from "react";

import { getStyles } from "./style";
import { SelectProps } from "../types";

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, invalid, placeholder, value, className, ...props }, ref) => {
    const { selectStyle } = getStyles({ invalid, className });

    return (
      <select ref={ref} value={value} {...props} className={selectStyle}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  },
);

Select.displayName = "Select";
