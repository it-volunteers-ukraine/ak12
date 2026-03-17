'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/utils';
import { ActiveLanguage, Locale } from '@/types';

export default function LanguageSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const isUk = locale === ActiveLanguage.UK;

	const handleChange = (nextLocale: Locale) => {
		const newPath = `/${nextLocale}${pathname.substring(3)}`;

		router.replace(newPath);
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
