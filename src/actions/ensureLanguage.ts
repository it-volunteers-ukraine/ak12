import { Locale } from "@/types";
import { supabaseServer } from "@/lib/supabase-server";

type LanguageRow = {
    id: string;
};

export const ensureLanguage = async (locale: Locale): Promise<LanguageRow> => {
    const { data: existingLanguage, error: selectError } = await supabaseServer
        .from("language")
        .select("id")
        .eq("code", locale)
        .maybeSingle();

    if (selectError) {
        throw new Error(
            `Failed to read language ${locale}: ${selectError.message}`,
        );
    }

    if (existingLanguage?.id) {
        return existingLanguage;
    }

    const { data: insertedLanguage, error: insertError } = await supabaseServer
        .from("language")
        .insert({ code: locale })
        .select("id")
        .single();

    if (insertError || !insertedLanguage?.id) {
        throw new Error(
            `Failed to create language ${locale}: ${insertError?.message}`,
        );
    }

    return insertedLanguage;
};
