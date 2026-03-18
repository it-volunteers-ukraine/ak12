'use server'

import { revalidatePath } from 'next/cache'
import { supabaseServer } from '@/lib/supabase-server'
import { Locale, Subdivision } from '@/types'

// HELPERS

// Gets language row id by locale code (e.g. 'uk' -> UUID)
// Same pattern as in header.ts ensureLanguage
const getLanguageId = async (locale: Locale): Promise<string> => {
  const { data, error } = await supabaseServer
    .from('language')
    .select('id')
    .eq('code', locale)
    .single()

  if (error || !data?.id) {
    throw new Error(`Language not found for locale: ${locale}`)
  }

  return data.id
}

// Maps a raw Supabase row to our Subdivision type
const mapRow = (row: Record<string, unknown>, languageCode: Locale): Subdivision => ({
  id: row.id as string,
  name: row.name as string,
  slug: row.slug as string | null,
  description: row.description as string,
  siteUrl: row.site_url as string | null,
  imageUrl: row.image_url as string,
  isActive: row.is_active as boolean,
  sortOrder: row.sort_order as number,
  languageCode,
  languageId: row.language_id as string,
})

// PUBLIC (frontend)

// Returns only active subdivisions for the given locale, sorted by sort_order.
// Used in SubdivisionsSection component on the landing page.
export async function getSubdivisions(locale: Locale): Promise<Subdivision[]> {
  const languageId = await getLanguageId(locale)

  const { data, error } = await supabaseServer
    .from('subdivision')
    .select('*')
    .eq('language_id', languageId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    throw new Error(`Failed to load subdivisions for ${locale}: ${error.message}`)
  }

  return (data ?? []).map((row) => mapRow(row, locale))
}

// Returns a single subdivision by slug and locale.
// Reserved for detail card or modal — not yet used in the frontend.
export async function getSubdivisionBySlug(
  slug: string,
  locale: Locale,
): Promise<Subdivision | null> {
  const languageId = await getLanguageId(locale)

  const { data, error } = await supabaseServer
    .from('subdivision')
    .select('*')
    .eq('language_id', languageId)
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load subdivision ${slug} for ${locale}: ${error.message}`)
  }

  if (!data) {
    return null
  }

  return mapRow(data, locale)
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// Returns ALL subdivisions for the given locale, including inactive ones.
// Used in the admin panel table view.
export async function getAllSubdivisions(locale: Locale): Promise<Subdivision[]> {
  const languageId = await getLanguageId(locale)

  const { data, error } = await supabaseServer
    .from('subdivision')
    .select('*')
    .eq('language_id', languageId)
    .order('sort_order', { ascending: true })

  if (error) {
    throw new Error(`Failed to load all subdivisions for ${locale}: ${error.message}`)
  }

  return (data ?? []).map((row) => mapRow(row, locale))
}

// Creates a new subdivision.
export async function createSubdivision(
  data: Omit<Subdivision, 'id'>,
): Promise<Subdivision> {
  const languageId = await getLanguageId(data.languageCode)

  const { data: inserted, error } = await supabaseServer
    .from('subdivision')
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description,
      site_url: data.siteUrl,
      image_url: data.imageUrl,
      is_active: data.isActive,
      sort_order: data.sortOrder,
      language_id: languageId,
    })
    .select()
    .single()

  if (error || !inserted) {
    throw new Error(`Failed to create subdivision: ${error?.message}`)
  }

  revalidatePath('/')

  return mapRow(inserted, data.languageCode)
}

// Updates an existing subdivision by id.
// Accepts only the fields that need to change (Partial).
export async function updateSubdivision(
  id: string,
  data: Partial<Omit<Subdivision, 'id'>>,
): Promise<Subdivision> {
  const updatePayload: Record<string, unknown> = {}

  if (data.name !== undefined) { updatePayload.name = data.name }
  if (data.slug !== undefined) { updatePayload.slug = data.slug }
  if (data.description !== undefined) { updatePayload.description = data.description }
  if (data.siteUrl !== undefined) { updatePayload.site_url = data.siteUrl }
  if (data.imageUrl !== undefined) { updatePayload.image_url = data.imageUrl }
  if (data.isActive !== undefined) { updatePayload.is_active = data.isActive }
  if (data.sortOrder !== undefined) { updatePayload.sort_order = data.sortOrder }

  const { data: updated, error } = await supabaseServer
    .from('subdivision')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()

  if (error || !updated) {
    throw new Error(`Failed to update subdivision ${id}: ${error?.message}`)
  }

  revalidatePath('/')

  const locale = (data.languageCode ?? 'uk') as Locale

  return mapRow(updated, locale)
}

// Deletes a subdivision by id.
export async function deleteSubdivision(id: string): Promise<void> {
  const { error } = await supabaseServer
    .from('subdivision')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete subdivision ${id}: ${error.message}`)
  }

  revalidatePath('/')
}