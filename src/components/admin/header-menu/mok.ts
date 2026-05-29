import { ContentIcon, VacancyIcon, SubdivisionIcon } from "../../../../public/icons";

export type SubmenuItem = {
  id: string;
  label: string;
  status?: string;
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
    { id: "hero", label: "Банер головної сторінки", status: "1min" },
    { id: "about", label: "Блок: про корпус", status: "1min" },
    { id: "mobilization", label: "Блок: мобілізація", status: "1min" },
    { id: "contract-18-24", label: "Блок: контракт 18-24", status: "1min" },
    { id: "transfer", label: "Блок: переведення ", status: "1min" },
    { id: "feedback", label: "Блок: звортнього зв'язку", status: "1min" },
    { id: "header-footer", label: "Шапка та підвал сайту", status: "1min" },
    { id: "privacy-policy", label: "Політика конфіденційності", status: "1min" },
  ],
  divisions: [{ id: "list", label: "Всі підрозділи ", status: "1min" }],
  careers: [{ id: "list", label: "Всі вакансії", status: "1min" }],
  ceo: [
    { id: "general", label: "Загальні", status: "1min" },
    { id: "users", label: "Користувачі", status: "1min" },
  ],
};
