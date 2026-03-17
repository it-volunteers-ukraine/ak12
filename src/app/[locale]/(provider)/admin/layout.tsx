import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 border-r p-4">
                <h2 className="text-lg font-semibold mb-6">Admin</h2>

                <nav className="space-y-2 flex flex-col gap-2">
                    <Link href="/admin">Dashboard</Link>

                    <Link href="/admin/vacancies">Vacancies</Link>
                </nav>
            </aside>

            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
