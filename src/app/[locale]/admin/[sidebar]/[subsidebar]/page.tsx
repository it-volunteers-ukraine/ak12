import { Locale } from "@/types";
import { HeroSchema } from "@/schema/heroSchema";
import { getHeroSectionContentAction } from "@/actions/heroActions";

import { FORM_COMPONENTS } from "./config-admin-forms";

export type AdminPageParams = {
    locale: Locale;
    sidebar: string;
    subsidebar: string;
};
interface PageProps {
    params: Promise<AdminPageParams>;
}

export default async function AdminPage({ params }: PageProps) {
    const { locale, subsidebar } = await params;

    const sectionData = await getHeroSectionContentAction<HeroSchema>(locale);

    const SelectedForm = FORM_COMPONENTS[subsidebar];

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border">
            <h1 className="text-2xl font-bold mb-6">
                Редагування: {subsidebar}
            </h1>

            {SelectedForm && (
                <SelectedForm
                    data={sectionData}
                    locale={locale}
                />
            )}
        </div>
    );
}
