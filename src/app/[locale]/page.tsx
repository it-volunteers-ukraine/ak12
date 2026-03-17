import { Locale, MenuContent } from "@/types";
import { Footer, Header, HomePage } from "@/components";
import menuContentJson from "../../data/menuContent.json";

const getMenuContent = (locale: Locale): MenuContent => {
	return menuContentJson[locale] || menuContentJson.uk;
};

export default async function Home({ params }: { params: { locale: Locale } }) {
	const resolvedParams = await params;
	const menuContent = getMenuContent(resolvedParams.locale);

	return (
		<>
			<Header content={menuContent} />
			<main className='text-3xl p-6'>
				<HomePage />
			</main>
			<Footer content={menuContent} />
		</>
	);
}

