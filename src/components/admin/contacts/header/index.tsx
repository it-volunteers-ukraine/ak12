import { getHeaderContentByLocale } from "@/actions/header";
import { HeaderForm } from "@/components/admin/header-content";

export default async function HeaderContent() {
    const [ukContent, enContent] = await Promise.all([
        getHeaderContentByLocale("uk"),
        getHeaderContentByLocale("en"),
    ]);

    return (
        <div className="grid gap-6 max-w-292 mx-auto">
            <HeaderForm
                locale="uk"
                content={ukContent}
            />
            <HeaderForm
                locale="en"
                content={enContent}
            />
        </div>
    );
}
