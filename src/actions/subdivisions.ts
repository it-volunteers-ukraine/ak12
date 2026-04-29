"use server";

import { revalidatePath } from "next/cache";
import { locales } from "@/constants";
import { supabaseServer } from "@/lib/supabase-server";
import { Locale, Subdivision } from "@/types";
import { storedImageSchema } from "@/components/admin/subdivisions-section/config";

// HELPERS

const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

// Gets language row id by locale code (e.g. 'uk' -> UUID)
const languageIdCache = new Map<string, string>();

const getLanguageId = async (locale: string): Promise<string | null> => {
  if (!isLocale(locale)) {
    return null;
  }

  if (languageIdCache.has(locale)) {
    return languageIdCache.get(locale)!;
  }

  const { data, error } = await supabaseServer.from("language").select("id").eq("code", locale).single();

  if (error || !data?.id) {
    throw new Error(`Language not found for locale: ${locale}`);
  }

  // Зберегти в кеш
  languageIdCache.set(locale, data.id);

  return data.id;
};

// Maps a raw Supabase row to our Subdivision type
const mapRow = (row: Record<string, any>, languageCode: Locale): Subdivision => {

  const parsedImage = storedImageSchema.safeParse(row.image_url);
  const parsedHoverImage = storedImageSchema.safeParse(row.hover_image_url);

  return {
    id: row.id as string,
    name: row.name as string,
    slug: (row.slug as string) ?? "",
    description: row.description as string,
    siteUrl: row.site_url as string | null,
    imageUrl: parsedImage.success ? parsedImage.data : null,
    hoverImageUrl: parsedHoverImage.success ? parsedHoverImage.data : null,
    hoverName: row.hover_name as string | null,
    hoverDescription: row.hover_description as string | null,
    isActive: row.is_active as boolean,
    sortOrder: row.sort_order as number,
    updatedAt: row.updated_at as string,
    languageCode,
    languageId: row.language_id as string,
  };
};

// PUBLIC (frontend)

// Returns only active subdivisions for the given locale, sorted by sort_order.
export async function getSubdivisions(locale: Locale): Promise<Subdivision[]> {
  const languageId = await getLanguageId(locale);

  if (!languageId) {
    return [];
  }

  const { data, error } = await supabaseServer
    .from("subdivision")
    .select("*")
    .eq("language_id", languageId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load subdivisions for ${locale}: ${error.message}`);
  }

  return (data ?? []).map((row) => mapRow(row, locale));
}

// Returns a single subdivision by slug and locale.
export async function getSubdivisionBySlug(slug: string, locale: Locale): Promise<Subdivision | null> {
  const languageId = await getLanguageId(locale);

  if (!languageId) {
    return null;
  }

  const { data, error } = await supabaseServer
    .from("subdivision")
    .select("*")
    .eq("language_id", languageId)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load subdivision ${slug} for ${locale}: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapRow(data, locale);
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// Returns ALL subdivisions for the given locale, including inactive ones.
export async function getAllSubdivisions(locale: Locale): Promise<Subdivision[]> {
  const languageId = await getLanguageId(locale);

  if (!languageId) {
    return [];
  }

  const { data, error } = await supabaseServer
    .from("subdivision")
    .select("*")
    .eq("language_id", languageId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load all subdivisions for ${locale}: ${error.message}`);
  }

  return (data ?? []).map((row) => mapRow(row, locale));
}

// Creates a new subdivision.
export async function createSubdivision(data: Omit<Subdivision, "id">): Promise<Subdivision> {
  const languageId = await getLanguageId(data.languageCode);

  if (!languageId) {
    throw new Error(`Language not found for locale: ${data.languageCode}`);
  }

  const { data: inserted, error } = await supabaseServer
    .from("subdivision")
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description,
      site_url: data.siteUrl,
      image_url: data.imageUrl,
      hover_image_url: data.hoverImageUrl,
      hover_name: data.hoverName,
      hover_description: data.hoverDescription,
      is_active: data.isActive,
      sort_order: data.sortOrder,
      language_id: languageId,
    })
    .select()
    .single();

  if (error || !inserted) {
    throw new Error(`Failed to create subdivision: ${error?.message}`);
  }

  revalidatePath("/");

  return mapRow(inserted, data.languageCode);
}

// Updates an existing subdivision by id.
export async function updateSubdivision(id: string, data: Partial<Omit<Subdivision, "id">>): Promise<Subdivision> {
  const updatePayload: Record<string, unknown> = {};

  if (data.name !== undefined) {
    updatePayload.name = data.name;
  }
  if (data.slug !== undefined) {
    updatePayload.slug = data.slug;
  }
  if (data.description !== undefined) {
    updatePayload.description = data.description;
  }
  if (data.siteUrl !== undefined) {
    updatePayload.site_url = data.siteUrl;
  }
  if (data.imageUrl !== undefined) {
    updatePayload.image_url = data.imageUrl;
  }
  if (data.hoverImageUrl !== undefined) {
    updatePayload.hover_image_url = data.hoverImageUrl;
  }
  if (data.hoverName !== undefined) {
    updatePayload.hover_name = data.hoverName;
  }
  if (data.hoverDescription !== undefined) {
    updatePayload.hover_description = data.hoverDescription;
  }
  if (data.isActive !== undefined) {
    updatePayload.is_active = data.isActive;
  }
  if (data.sortOrder !== undefined) {
    updatePayload.sort_order = data.sortOrder;
  }
  if (data.updatedAt !== undefined) {
  updatePayload.updated_at = data.updatedAt;
}

  const { data: updated, error } = await supabaseServer
    .from("subdivision")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error || !updated) {
    throw new Error(`Failed to update subdivision ${id}: ${error?.message}`);
  }

  revalidatePath("/");

  const locale = (data.languageCode ?? "uk") as Locale;

  return mapRow(updated, locale);
}

// Deletes a subdivision by id.
export async function deleteSubdivision(id: string): Promise<void> {
  const { error } = await supabaseServer.from("subdivision").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete subdivision ${id}: ${error.message}`);
  }

  revalidatePath("/");
}

// Update sortOrder for an array of subdivisions with a single query
export async function updateSubdivisionsOrder(
  items: { id: string; sortOrder: number }[],
): Promise<void> {
  const updates = items.map(({ id, sortOrder }) =>
    supabaseServer
      .from("subdivision")
      .update({ sort_order: sortOrder })
      .eq("id", id),
  );

  await Promise.all(updates);
  revalidatePath("/");
}
