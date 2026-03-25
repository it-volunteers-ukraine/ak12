import { revalidatePath } from "next/cache";

import { Locale } from "@/types";
import { supabaseServer } from "@/lib/supabase-server";

import { ensureLanguage } from "./ensureLanguage";

import "server-only";

export type HeaderLink = {
    id: string;
    href: string;
    label: string;
};
export type HeaderContent = {
    cta: HeaderLink;
    logoText: string;
    links: HeaderLink[];
};

const isHeaderLink = (value: unknown): value is HeaderLink => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const link = value as HeaderLink;

    return typeof link.label === "string" && typeof link.href === "string";
    typeof link.id === "string";
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

export const getHeaderContentByLocale = async (
    locale: Locale,
): Promise<HeaderContent | null> => {
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
        throw new Error(
            `Failed to load header for ${locale}: ${sectionError.message}`,
        );
    }

    const sectionRow = sectionRows?.[0];

    if (!sectionRow?.content || !isHeaderContent(sectionRow.content)) {
        return null;
    }

    return sectionRow.content;
};

const buildHeaderFromForm = (formData: FormData): HeaderContent => {
    const links: HeaderLink[] = [1, 2, 3, 4, 5]
        .map((i) => {
            const label = String(formData.get(`link${i}Label`) ?? "").trim();
            const href = String(formData.get(`link${i}Href`) ?? "").trim();
            let id = String(formData.get(`link${i}Id`) ?? "").trim();

            if (!id && href) {
                id =
                    href === "/"
                        ? "home"
                        : href.replace(/^\//, "").replace(/\//g, "-");
            }

            return { id, label, href };
        })
        .filter((link) => link.label && link.href);

    let ctaId = String(formData.get("ctaId") ?? "").trim();
    const ctaHref = String(formData.get("ctaHref") ?? "").trim();

    if (!ctaId && ctaHref) {
        ctaId = "cta-" + ctaHref.replace(/^\//, "").replace(/\//g, "-");
    }

    return {
        logoText: String(formData.get("logoText") ?? "").trim(),
        links,
        cta: {
            id: ctaId || "cta-default",
            label: String(formData.get("ctaLabel") ?? "").trim(),
            href: ctaHref,
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
        throw new Error(
            `Failed to read existing header for ${locale}: ${existingError.message}`,
        );
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
            throw new Error(
                `Failed to update header for ${locale}: ${updateError.message}`,
            );
        }
    } else {
        const { error: insertError } = await supabaseServer
            .from("site_content")
            .insert({
                section_key: "header",
                content,
                is_active: true,
                language_id: languageRow.id,
            });

        if (insertError) {
            throw new Error(
                `Failed to create header for ${locale}: ${insertError.message}`,
            );
        }
    }

    revalidatePath("/");
    revalidatePath("/admin");
};

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

export const restoreHeaderAction = async (locale: Locale) => {
    "use server";

    const languageRow = await ensureLanguage(locale);

    const { error: updateError } = await supabaseServer
        .from("site_content")
        .update({
            content: {
                logoText: locale === "uk" ? "Мій Логотип" : "My Logo",
                links: [
                    {
                        id: "aboutthebuilding",
                        label:
                            locale === "uk"
                                ? "Про корпус"
                                : "About the Building",
                        href: "/aboutthebuilding",
                    },
                    {
                        id: "divisions",
                        label: locale === "uk" ? "Підрозділи" : "Divisions",
                        href: "/divisions",
                    },
                    {
                        id: "services",
                        label: locale === "uk" ? "Як долучитись" : "Services",
                        href: "/services",
                    },
                    {
                        id: "careers",
                        label: locale === "uk" ? "Вакансії" : "Careers",
                        href: "/careers",
                    },
                    {
                        id: "contact",
                        label: locale === "uk" ? "Контакти" : "Contact",
                        href: "/contact",
                    },
                ],
                cta: {
                    label: locale === "uk" ? "Зареєструватися" : "Sign Up",
                    href: "/signup",
                },
            },
            is_active: true,
            updated_at: new Date().toISOString(),
        })
        .eq("section_key", "header")
        .eq("language_id", languageRow.id);

    if (updateError) {
        console.error(`Помилка для ${locale}:`, updateError.message);

        return { success: false };
    }

    revalidatePath("/");

    return { success: true };
};
