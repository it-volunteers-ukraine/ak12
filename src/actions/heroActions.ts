"use server";

import { cache } from "react";

import { Locale } from "@/types";
import { HeroSchema } from "@/schema/heroSchema";
import { supabaseServer } from "@/lib/supabase-server";

import { ensureLanguage } from "./ensureLanguage";

export const getHeroSectionContentAction = cache(
    async <T = HeroSchema>(locale: Locale): Promise<T | null> => {
        const languageRow = await ensureLanguage(locale);

        const { data, error } = await supabaseServer
            .from("site_content")
            .select("content")
            .eq("section_key", "hero")
            .eq("language_id", languageRow.id)
            .eq("is_active", true)
            .maybeSingle();

        if (error) {
            console.error(`Error fetching section 'hero':`, error);

            return null;
        }

        return (data?.content as T) || null;
    },
);

export const updateHeroSectionAction = async (
    formData: FormData,
    locale: Locale,
) => {
    try {
        const rawContent = Object.fromEntries(formData.entries());

        console.log("1. Raw data from form:", rawContent);
        const parsed = HeroSchema.safeParse(rawContent);

        if (!parsed.success) {
            console.error("[Validation Error]:", parsed.error.flatten());

            return {
                success: false,
                error: "Дані форми не пройшли перевірку Zod.",
            };
        }

        const validatedContent = parsed.data;
        const languageRow = await ensureLanguage(locale);

        console.log("3. Language found:", languageRow.id);

        const { error } = await supabaseServer
            .from("site_content")
            .update({
                content: validatedContent,
                updated_at: new Date().toISOString(),
            })
            .eq("section_key", "hero")
            .eq("language_id", languageRow.id)
            .select();

        if (error) {
            console.error("4. Supabase Error:", error.message);
            throw error;
        }

        console.log("5. Success! Updated rows:", parsed.data);

        return { success: true };
    } catch (error: any) {
        console.error("Action Error:", error);

        return { success: false, error: "Помилка сервера при збереженні" };
    }
};
