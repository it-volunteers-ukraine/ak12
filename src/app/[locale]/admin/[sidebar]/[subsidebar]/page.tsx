import { FORM_COMPONENTS } from "./config-admin-forms";

export type AdminPageParams = {
    locale: string;
    sidebar: string;
    subsidebar: string;
};
interface PageProps {
    params: Promise<AdminPageParams>;
}

export default async function AdminPage({ params }: PageProps) {
    const { subsidebar } = await params;

    const SelectedForm = FORM_COMPONENTS[subsidebar];

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border">
            <h1 className="text-2xl font-bold mb-6">
                Редагування: {subsidebar}
            </h1>

            {SelectedForm && <SelectedForm />}
        </div>
    );
}
