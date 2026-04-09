import { Path, FieldValues } from "react-hook-form";

export type SelectOption = {
  label: string;
  value: string;
};
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  className?: string;
  placeholder?: string;
  options: SelectOption[];
};
export type FormSelectProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  className?: string;
  placeholder?: string;
  options: SelectOption[];
};
