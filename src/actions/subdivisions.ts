'use server'

import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { Locale, Subdivision } from '@/types'

/**
 * TEMPORARY: Database path for JSON-based storage.
 * To be replaced with PostgreSQL connection in the future.
 */
const DB_PATH = path.join(process.cwd(), 'src/data/subdivisions.json')

/**
 * Reads the JSON database. Handles missing files (ENOENT) safely.
 */
async function readDb(): Promise<{ subdivisions: Subdivision[] }> {
  try {
    const raw = await readFile(DB_PATH, 'utf-8')

    return JSON.parse(raw)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return { subdivisions: [] }
    }
    
    throw error
  }
}

/**
 * Persists data to the JSON file and ensures the directory exists.
 */
async function writeDb(data: { subdivisions: Subdivision[] }): Promise<void> {
  const dir = path.dirname(DB_PATH)

  await mkdir(dir, { recursive: true })

  await writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * Revalidates all localized routes under the [locale] segment.
 * Essential for sync between Admin panel and multi-language Frontend.
 */
function revalidateFrontend(): void {
  // Using 'layout' ensures all sub-routes like /[locale]/(site)/... are refreshed
  revalidatePath('/[locale]', 'layout')
}

// PUBLIC (FRONTEND)

export async function getSubdivisions(locale: Locale): Promise<Subdivision[]> {
  const db = await readDb()

  return db.subdivisions
    .filter((s) => s.isActive && s.languageCode === locale)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

//ADMIN (MANAGEMENT)

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

  revalidateFrontend()

  return newItem
}

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

  revalidateFrontend()

  return db.subdivisions[index]
}

export async function deleteSubdivision(id: string): Promise<void> {
  const db = await readDb()

  db.subdivisions = db.subdivisions.filter((s) => s.id !== id)

  await writeDb(db)

  revalidateFrontend()
}