import { Locale, MenuContent } from "@/types";
import { Footer, Header, HomePage } from "@/components";
import menuContentJson from "../../data/menuContent.json";
import { getTranslations } from "next-intl/server";

const getMenuContent = (locale: Locale): MenuContent => {
	return menuContentJson[locale] || menuContentJson.uk;
};

export default async function Home({ params }: { params: { locale: Locale } }) {
	const resolvedParams = await params;
	const menuContent = getMenuContent(resolvedParams.locale);

	const footerText = await getTranslations({ locale: resolvedParams.locale, namespace: "footer" });

	const footerTranslations = {
    navigation: footerText('navigation'),
    contact: footerText('contact'), 
    social: footerText('social'),
    copyright: footerText('copyright'),
  };

	return (
		<>
			<Header content={menuContent} />
			<main className='text-3xl p-6'>
				<HomePage />
			</main>
			<Footer content={menuContent} footerTranslations={footerTranslations} />
		</>
	);
}

