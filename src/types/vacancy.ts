import { Locale } from "@/types/locale";

export type VacancyType = "frontline" | "backline";

export interface Vacancy {
  id: string;
  position: string;
  slug: string | null;
  description: string;
  type: VacancyType;
  salary_min: number;
  salary_max: number | null;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  language_id: string;
}

export interface VacancyWithLanguage extends Omit<Vacancy, "language_id"> {
  language: {
    code: Locale;
  };
}
