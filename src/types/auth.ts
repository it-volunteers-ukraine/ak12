export type FieldErrors = {
  email?: string[];
  password?: string[];
};

export type State = {
  fieldErrors: FieldErrors;
  error: string;
};
