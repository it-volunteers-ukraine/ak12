export type SubmenuItem = {
  id: string;
  label: string;
  status?: string;
};

export const mainAdminNavigation = [
  { id: "content", label: "Контент" },
  { id: "divisions", label: "Підрозділи" },
  { id: "careers", label: "Вакансії" },
  { id: "ceo", label: "CEO" },
];

export const sidebarToSubmenuMap: Record<string, SubmenuItem[]> = {
  content: [
    { id: "hero", label: "Банер головної сторінки", status: "1min" },
    { id: "mobilization", label: "Блок: мобілізація", status: "1min" },
    { id: "contract-18-24", label: "Блок: контракт 18-24", status: "1min" },
    { id: "transfer", label: "Блок: переведення ", status: "1min" },
    { id: "header-footer", label: "Шапка та підвал сайту", status: "1min" },
  ],
  divisions: [
    { id: "list", label: "Всі підрозділи ", status: "1min" },
    { id: "new", label: "Новий підрозділ ", status: "1min" },
  ],
  careers: [
    { id: "combat", label: "Бойові вакансії", status: "1min" },
    { id: "logistics", label: "Тилові вакансії", status: "1min" },
  ],
  ceo: [
    { id: "general", label: "Загальні", status: "1min" },
    { id: "users", label: "Користувачі", status: "1min" },
  ],
};
