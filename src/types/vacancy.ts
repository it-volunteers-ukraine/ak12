import { Locale } from "@/types/locale";

export const vacancyTypes = ["frontline", "backline"] as const;

export type VacancyType = typeof vacancyTypes[number];

export interface Vacancy {
  id: string;
  position: string;
  slug: string | null;
  description: string;
  type: VacancyType;
  salary_min: number;
  salary_max: number | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  language_id: string;
  created_at: string;
  updated_at: string; 
}

export interface VacancyWithLanguage extends Omit<Vacancy, "language_id"> {
  language: {
    code: Locale;
  };
}

export interface VacancyMapped {
  id: string;
  position: string;
  slug: string | null;
  description: string;
  type: VacancyType;
  salaryMin: number;
  salaryMax: number | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  language: {
    code: Locale;
  };
  createdAt: string;
  updatedAt: string; 
}
