/* import { Locale } from "@/types";
import { supabaseServer } from "@/lib/supabase-server";

import { ensureLanguage } from "./ensureLanguage";

export type SectionKey = "header" | "join" | "banner" | "footer";
export type SectionContent = {
    title: string;
    description?: string;
    links?: {
        href: string;
        label: string;
}[];
};
export type SiteSection = {
    id: string;
    content: SectionContent;
    section_key: SectionKey;
};

export const saveSectionAction = async (formData: FormData) => {
    "use server";

    const locale: Locale =
        String(formData.get("locale")) === "uk" ? "uk" : "en";
    const sectionKey = String(formData.get("sectionKey")) as SectionKey;
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    const languageRow = await ensureLanguage(locale);

    const content = { title, description };

    const { data: existingRows } = await supabaseServer
        .from("site_content")
        .select("id")
        .eq("section_key", sectionKey)
        .eq("language_id", languageRow.id)
        .limit(1);

    const existingRow = existingRows?.[0];

    if (existingRow?.id) {
        await supabaseServer
            .from("site_content")
            .update({
                content,
                is_active: true,
                updated_at: new Date().toISOString(),
            })
            .eq("id", existingRow.id);
    } else {
        await supabaseServer.from("site_content").insert({
            section_key: sectionKey,
            content,
            is_active: true,
            language_id: languageRow.id,
        });
    }
};
 */
