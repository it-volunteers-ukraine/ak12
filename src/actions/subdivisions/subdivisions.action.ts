"use server";

import { revalidatePath } from "next/cache";
import { locales } from "@/constants";
import { Locale, Subdivision } from "@/types";
import { databaseClient } from "@/lib/database/database-client";
import { storedImageSchema } from "@/components/admin/subdivisions-section/config";

const isLocale = (value: string): value is Locale => locales.includes(value as Locale);
const languageIdCache = new Map<string, string>();

const getLanguageId = async (locale: string): Promise<string | null> => {
  if (!isLocale(locale)) {
    return null;
  }

  if (languageIdCache.has(locale)) {
    return languageIdCache.get(locale)!;
  }

  const { data, error } = await databaseClient.from("language").select("id").eq("code", locale).single();

  if (error || !data?.id) {
    throw new Error(`Language not found for locale: ${locale}`);
  }

  const languageId = String(data.id);

  languageIdCache.set(locale, languageId);

  return languageId;
};

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

export async function getSubdivisions(locale: Locale): Promise<Subdivision[]> {
  const languageId = await getLanguageId(locale);

  if (!languageId) {
    return [];
  }

  const { data, error } = await databaseClient
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

export async function getSubdivisionBySlug(slug: string, locale: Locale): Promise<Subdivision | null> {
  const languageId = await getLanguageId(locale);

  if (!languageId) {
    return null;
  }

  const { data, error } = await databaseClient
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

export async function getAllSubdivisions(locale: Locale): Promise<Subdivision[]> {
  const languageId = await getLanguageId(locale);

  if (!languageId) {
    return [];
  }

  const { data, error } = await databaseClient
    .from("subdivision")
    .select("*")
    .eq("language_id", languageId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load all subdivisions for ${locale}: ${error.message}`);
  }

  return (data ?? []).map((row) => mapRow(row, locale));
}

export async function createSubdivision(data: Omit<Subdivision, "id">): Promise<Subdivision> {
  const languageId = await getLanguageId(data.languageCode);

  if (!languageId) {
    throw new Error(`Language not found for locale: ${data.languageCode}`);
  }

  const { data: inserted, error } = await databaseClient
    .from("subdivision")
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description,
      site_url: data.siteUrl,
      image_url: data.imageUrl ? JSON.stringify(data.imageUrl) : null,
      hover_image_url: data.hoverImageUrl ? JSON.stringify(data.hoverImageUrl) : null,
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

const mapSubdivisionToDbPayload = (data: Partial<Omit<Subdivision, "id" | "languageCode" | "languageId">>) => {
  const payload: Record<string, string | number | boolean | null | undefined> = {};

  if (data.name !== undefined) {
    payload.name = data.name;
  }
  if (data.slug !== undefined) {
    payload.slug = data.slug;
  }
  if (data.description !== undefined) {
    payload.description = data.description;
  }
  if (data.siteUrl !== undefined) {
    payload.site_url = data.siteUrl;
  }
  if (data.hoverName !== undefined) {
    payload.hover_name = data.hoverName;
  }
  if (data.hoverDescription !== undefined) {
    payload.hover_description = data.hoverDescription;
  }
  if (data.isActive !== undefined) {
    payload.is_active = data.isActive;
  }
  if (data.sortOrder !== undefined) {
    payload.sort_order = data.sortOrder;
  }
  if (data.updatedAt !== undefined) {
    payload.updated_at = data.updatedAt;
  }
  if (data.imageUrl !== undefined) {
    payload.image_url = data.imageUrl ? JSON.stringify(data.imageUrl) : null;
  }
  if (data.hoverImageUrl !== undefined) {
    payload.hover_image_url = data.hoverImageUrl ? JSON.stringify(data.hoverImageUrl) : null;
  }

  return payload;
};

export async function updateSubdivision(id: string, data: Partial<Omit<Subdivision, "id">>): Promise<Subdivision> {
  const updatePayload = mapSubdivisionToDbPayload(data);

  const { data: updated, error } = await databaseClient
    .from("subdivision")
    .update(updatePayload as any)
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

export async function deleteSubdivision(id: string): Promise<void> {
  const { error } = await databaseClient.from("subdivision").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete subdivision ${id}: ${error.message}`);
  }

  revalidatePath("/");
}

export async function updateSubdivisionsOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
  const updates = items.map(({ id, sortOrder }) =>
    databaseClient.from("subdivision").update({ sort_order: sortOrder }).eq("id", id),
  );

  const results = await Promise.all(updates);

  const failed = results.filter((r) => r.error);

  if (failed.length > 0) {
    throw new Error(
      `Failed to update sort order for ${failed.length} items: ${failed.map((r) => r.error?.message).join(", ")}`,
    );
  }

  revalidatePath("/");
}