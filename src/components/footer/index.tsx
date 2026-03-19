import Link from 'next/link';

import { MenuContent } from '@/types';

type FooterTranslations = {
	navigation: string;
	contact: string;
	social: string;
	copyright: string;
}

type FooterProps = {
	content: MenuContent;
	footerTranslations: FooterTranslations;
};

export const Footer = ({ content, footerTranslations }: FooterProps) => {
	return (
		<footer className='px-40 '>
			<div className='flex justify-between'>
				<nav>
					<p className='uppercase text-xl mb-3 font-bold'>{footerTranslations.navigation}</p>
					<ul className='flex flex-col gap-2'>
						{content.navigation.map((item) => {
							return (
								<li key={item.id}>
									<Link href={`#${item.id}`}>{item.label}</Link>
								</li>
							);
						})}
					</ul>
				</nav>
				<div>
					<p className='uppercase text-xl mb-3 font-bold'>{footerTranslations.contact}</p>
					<ul className='flex flex-col gap-2'>
						{content.contacts.map((item) => {
							return (
								<li key={item.id}>
									<p className='uppercase text-base font-bold'>{item.label}</p>
									<a href={item.url} target='_blank' rel='noopener noreferrer'>
										{item.value}
									</a>
								</li>
							);
						})}
					</ul>
				</div>
				<div>
					<p className='uppercase text-xl mb-3 font-bold'>{footerTranslations.social}</p>
					<ul className='flex flex-col gap-2'>
						{content.social.map((item) => {
							return (
								<li key={item.id}>
									<a href={item.url} target='_blank' rel='noopener noreferrer'>
										{item.label}
									</a>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<p className='text-center'>© 2026. {footerTranslations.copyright}</p>
		</footer>
	);
};
