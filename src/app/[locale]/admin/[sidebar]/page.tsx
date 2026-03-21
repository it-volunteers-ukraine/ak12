import { redirect } from "next/navigation";

export default async function SidebarPage({
    params,
}: {
    params: Promise<{ sidebar: string }>;
}) {
    const { sidebar } = await params;

    const defaultSub = sidebar === "content" ? "openings" : "header";

    redirect(`/admin/${sidebar}/${defaultSub}`);
}
