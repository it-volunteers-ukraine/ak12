'use client';

import { useLocale } from 'next-intl';

import { cn } from '@/utils';
import { ActiveLanguage, Locale } from '@/types';
import { usePathname, useRouter } from '@/i18n/navigation';

export default function LanguageSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const isUk = locale === ActiveLanguage.UK;

	const handleChange = (nextLocale: Locale) => {
		router.replace(pathname, { locale: nextLocale });
	};

	return (
		<div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
			<button
				disabled={!isUk}
				className={cn(!isUk && 'text-gray-400')}
				onClick={() => handleChange(ActiveLanguage.EN)}
			>
				{ActiveLanguage.EN.toUpperCase()}
			</button>
			<button
				disabled={isUk}
				className={cn(isUk && 'text-gray-400')}
				onClick={() => handleChange(ActiveLanguage.UK)}
			>
				{ActiveLanguage.UK.toUpperCase()}
			</button>
		</div>
	);
}
