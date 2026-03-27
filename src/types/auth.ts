export interface LoginData {
  email: string;
  password: string;
}

export type FieldErrors = {
  email?: string[];
  password?: string[];
};
