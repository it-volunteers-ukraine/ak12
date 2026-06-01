import { ContentIcon, VacancyIcon, SubdivisionIcon } from "../../../../public/icons";

export type SubmenuItem = {
  id: string;
  label: string;
  updatedAt?: string;
};

export const mainAdminNavigation = [
  { id: "content", label: "Контент", icon: ContentIcon },
  { id: "divisions", label: "Підрозділи", icon: SubdivisionIcon },
  { id: "careers", label: "Вакансії", icon: VacancyIcon },

  // SEO section intentionally hidden from the admin UI.
  // Related functionality is preserved.
  // { id: "ceo", label: "SEO", icon: CEOIcon },
];

export const sidebarToSubmenuMap: Record<string, SubmenuItem[]> = {
  content: [
    { id: "hero", label: "Банер головної сторінки" },
    { id: "about", label: "Блок: про корпус" },
    { id: "mobilization", label: "Блок: мобілізація" },
    { id: "contract-18-24", label: "Блок: контракт 18-24" },
    { id: "transfer", label: "Блок: переведення " },
    { id: "feedback", label: "Блок: звортнього зв'язку" },
    { id: "header-footer", label: "Шапка та підвал сайту" },
    { id: "privacy-policy", label: "Політика конфіденційності" },
  ],
  divisions: [{ id: "list", label: "Всі підрозділи " }],
  careers: [{ id: "list", label: "Всі вакансії" }],
};
