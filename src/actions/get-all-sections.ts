import { Locale } from "@/types";
import { supabaseServer } from "@/lib/supabase-server";

import { ensureLanguage } from "./ensureLanguage";

export const getAllSections = async (locale: Locale) => {
    const languageRow = await ensureLanguage(locale);

    const { data, error } = await supabaseServer
        .from("site_content")
        .select("id, section_key, content")
        .eq("language_id", languageRow.id)
        .eq("is_active", true);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};
