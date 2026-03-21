import { supabaseServer } from "@/lib/supabase-server";

export default async function HomePage() {
    const { data: vacancies } = await supabaseServer
        .from("vacancy")
        .select("*");

    return (
        <div>
            {vacancies?.map((v) => (
                <div key={v.id}>{v.position}</div>
            ))}
        </div>
    );
}
