export type FieldErrors = {
  email?: string[];
  password?: string[];
  code?: string[];
};

export type State = {
  error: string;
  fieldErrors: FieldErrors;
  needsTwoFactor?: boolean;
  locale?: string;
};
