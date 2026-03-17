'use client';

import { useTranslations } from 'next-intl';

import { MenuContent } from '@/types';

type FooterProps = {
	content: MenuContent;
};

export const Footer = ({ content }: FooterProps) => {
	const title = useTranslations('footer');

	return (
		<footer className='px-40 '>
			<div className='flex justify-between'>
				<nav>
					<p className='uppercase text-xl mb-3 font-bold'>{title('navigation')}</p>
					<ul className='flex flex-col gap-2'>
						{content.navigation.map((item) => {
							return (
								<li key={item.id}>
									<a href={`#${item.id}`}>{item.label}</a>
								</li>
							);
						})}
					</ul>
				</nav>
				<div>
					<p className='uppercase text-xl mb-3 font-bold'>{title('contact')}</p>
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
					<p className='uppercase text-xl mb-3 font-bold'>{title('social')}</p>
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
			<p className='text-center'>© 2026. {title('copyright')}</p>
		</footer>
	);
};
