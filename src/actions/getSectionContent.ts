import { z } from "zod";
import { cache } from "react";

import { Locale } from "@/types";
import { ensureLanguage } from "./ensureLanguage";
import { supabaseServer } from "@/lib/supabase-server";


export const getSectionContent = cache(async <T>(section: string, locale: Locale): Promise<T | null> => {
  const languageRow = await ensureLanguage(locale);

  const { data, error } = await supabaseServer
    .from("site_content")
    .select("content")
    .eq("section_key", section)
    .eq("is_active", true)
    .eq("language_id", languageRow.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data?.content) {
    return null;
  }

  return data.content as T;
});

export const getSectionContent = cache(
  async <T>(section: string, locale: Locale): Promise<T | null> => {
    const languageRow = await ensureLanguage(locale);

    const { data, error } = await supabaseServer
      .from("site_content")
      .select("content")
      .eq("section_key", section)
      .eq("is_active", true)
      .eq("language_id", languageRow.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data?.content) {
      return null;
    }

    return data.content as T;
  },
);
