import { Locale } from './locale';

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

export type MenuContentMap = {
	[key in Locale]: MenuContent;
};
