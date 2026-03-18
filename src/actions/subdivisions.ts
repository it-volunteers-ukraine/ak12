'use server'

import { readFile, writeFile, access, mkdir } from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { Locale, Subdivision } from '@/types'

// TEMPORARY: Reading from a local JSON file instead of a real database.
// Source data is taken from postgres-init/02-examples.sql and converted to JSON.
// TODO: Remove DB_PATH, readDb and writeDb when PostgreSQL is connected.

const DB_PATH = path.join(process.cwd(), 'src/data/subdivisions.json')

async function readDb(): Promise<{ subdivisions: Subdivision[] }> {
  try {
    await access(DB_PATH)
    const raw = await readFile(DB_PATH, 'utf-8')

    return JSON.parse(raw)
  } catch {
    return { subdivisions: [] }
  }
}

async function writeDb(data: { subdivisions: Subdivision[] }): Promise<void> {
  const dir = path.dirname(DB_PATH)

  try {
    await access(dir)
  } catch {
    await mkdir(dir, { recursive: true })
  }

  await writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

//PUBLIC (frontend)

// Used in SubdivisionsSection component on the landing page.//

export async function getSubdivisions(locale: Locale): Promise<Subdivision[]> {
  const db = await readDb()

  return db.subdivisions
    .filter((s) => s.isActive && s.languageCode === locale)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

// Returns a single subdivision by slug and locale.
// Reserved for detail card or modal — not yet used in the frontend.

export async function getSubdivisionBySlug(
  slug: string,
  locale: Locale,
): Promise<Subdivision | null> {
  const db = await readDb()

  return (
    db.subdivisions.find(
      (s) => s.slug === slug && s.languageCode === locale,
    ) ?? null
  )
}

// ADMIN

// Returns ALL subdivisions for the given locale, including inactive ones.

export async function getAllSubdivisions(locale: Locale): Promise<Subdivision[]> {
  const db = await readDb()

  return db.subdivisions
    .filter((s) => s.languageCode === locale)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

// Creates a new subdivision.

export async function createSubdivision(
  data: Omit<Subdivision, 'id'>,
): Promise<Subdivision> {
  const db = await readDb()

  const newItem: Subdivision = {
    ...data,
    id: crypto.randomUUID(),
  }

  db.subdivisions.push(newItem)
  await writeDb(db)
  revalidatePath('/')

  return newItem
}

// Updates an existing subdivision by id.
// Accepts only the fields that need to change (Partial).

export async function updateSubdivision(
  id: string,
  data: Partial<Omit<Subdivision, 'id'>>,
): Promise<Subdivision> {
  const db = await readDb()

  const index = db.subdivisions.findIndex((s) => s.id === id)

  if (index === -1) {
    throw new Error(`Subdivision with id "${id}" not found`)
  }

  db.subdivisions[index] = { ...db.subdivisions[index], ...data }
  await writeDb(db)
  revalidatePath('/')

  return db.subdivisions[index]
}

// Deletes a subdivision by id.

export async function deleteSubdivision(id: string): Promise<void> {
  const db = await readDb()

  db.subdivisions = db.subdivisions.filter((s) => s.id !== id)
  await writeDb(db)
  revalidatePath('/')
}