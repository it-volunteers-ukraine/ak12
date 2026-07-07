export type NavItem = {
  id: string;
  label: string;
  url?: string;
  value?: string;
};

export type MenuContent = {
  navigation: NavItem[];
  contacts: NavItem[];
  social: NavItem[];
};
