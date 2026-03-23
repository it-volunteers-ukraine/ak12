import { revalidatePath } from "next/cache";

import { supabaseServer } from "@/lib/supabase-server";
import { Locale } from "@/types";

export type HeaderLink = {
  label: string;
  href: string;
};

export type HeaderContent = {
  logoText: string;
  links: HeaderLink[];
  cta: HeaderLink;
};

type LanguageRow = {
  id: string;
};

const isHeaderLink = (value: unknown): value is HeaderLink => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const link = value as HeaderLink;

  return typeof link.label === "string" && typeof link.href === "string";
};

const isHeaderContent = (value: unknown): value is HeaderContent => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const content = value as HeaderContent;

  return (
    typeof content.logoText === "string" &&
    Array.isArray(content.links) &&
    content.links.every(isHeaderLink) &&
    isHeaderLink(content.cta)
  );
};

const ensureLanguage = async (locale: Locale): Promise<LanguageRow> => {
  const { data: existingLanguage, error: selectError } = await supabaseServer
    .from("language")
    .select("id")
    .eq("code", locale)
    .maybeSingle();

  if (selectError) {
    throw new Error(`Failed to read language ${locale}: ${selectError.message}`);
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
    throw new Error(`Failed to create language ${locale}: ${insertError?.message}`);
  }

  return insertedLanguage;
};

export const getHeaderContentByLocale = async (locale: Locale): Promise<HeaderContent | null> => {
  const languageRow = await ensureLanguage(locale);

  const { data: sectionRows, error: sectionError } = await supabaseServer
    .from("site_content")
    .select("id, content")
    .eq("section_key", "header")
    .eq("is_active", true)
    .eq("language_id", languageRow.id)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (sectionError) {
    throw new Error(`Failed to load header for ${locale}: ${sectionError.message}`);
  }

  const sectionRow = sectionRows?.[0];

  if (!sectionRow?.content || !isHeaderContent(sectionRow.content)) {
    return null;
  }

  return sectionRow.content;
};

const buildHeaderFromForm = (formData: FormData): HeaderContent => {
  const links: HeaderLink[] = [
    {
      label: String(formData.get("link1Label") ?? "").trim(),
      href: String(formData.get("link1Href") ?? "").trim(),
    },
    {
      label: String(formData.get("link2Label") ?? "").trim(),
      href: String(formData.get("link2Href") ?? "").trim(),
    },
    {
      label: String(formData.get("link3Label") ?? "").trim(),
      href: String(formData.get("link3Href") ?? "").trim(),
    },
  ].filter((link) => link.label && link.href);

  return {
    logoText: String(formData.get("logoText") ?? "").trim(),
    links,
    cta: {
      label: String(formData.get("ctaLabel") ?? "").trim(),
      href: String(formData.get("ctaHref") ?? "").trim(),
    },
  };
};

export const saveHeaderAction = async (formData: FormData) => {
  "use server";

  const localeValue = String(formData.get("locale") ?? "");
  const locale: Locale = localeValue === "uk" ? "uk" : "en";
  const languageRow = await ensureLanguage(locale);
  const content = buildHeaderFromForm(formData);

  if (!isHeaderContent(content)) {
    throw new Error("Header content has invalid shape");
  }

  const { data: existingRows, error: existingError } = await supabaseServer
    .from("site_content")
    .select("id")
    .eq("section_key", "header")
    .eq("language_id", languageRow.id)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (existingError) {
    throw new Error(`Failed to read existing header for ${locale}: ${existingError.message}`);
  }

  const existingRow = existingRows?.[0];

  if (existingRow?.id) {
    const { error: updateError } = await supabaseServer
      .from("site_content")
      .update({
        content,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingRow.id);

    if (updateError) {
      throw new Error(`Failed to update header for ${locale}: ${updateError.message}`);
    }
  } else {
    const { error: insertError } = await supabaseServer.from("site_content").insert({
      section_key: "header",
      content,
      is_active: true,
      language_id: languageRow.id,
    });

    if (insertError) {
      throw new Error(`Failed to create header for ${locale}: ${insertError.message}`);
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
};
