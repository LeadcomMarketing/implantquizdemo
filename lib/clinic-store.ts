import 'server-only'
import { cache as reactCache } from 'react'
import { unstable_cache } from 'next/cache'
import { get, put } from '@vercel/blob'
import type { ClinicConfig } from '@/lib/types'
import { DEFAULT_CLINIC, SEED_CLINICS } from '@/lib/clinics'

// Single JSON blob holding all admin-managed clinics.
const BLOB_KEY = 'clinics/clinics.json'

// How long a cached public read is served before the Blob store is consulted
// again. Clinic config changes rarely (only via admin), so a short window keeps
// Blob operations minimal while admin edits still appear on the site within ~1
// minute. The admin panel itself always reads live data (see below).
const PUBLIC_CACHE_SECONDS = 60

// Vercel can authenticate Blob either via a static BLOB_READ_WRITE_TOKEN or,
// for stores connected through "Connect Database", via OIDC using BLOB_STORE_ID
// plus the platform's auto-injected VERCEL_OIDC_TOKEN.
export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

function hasBlob(): boolean {
  return isBlobConfigured()
}

// Raw read straight from the Blob store. Returns null when the blob doesn't
// exist yet (empty store); THROWS on any real failure (network, auth, quota) so
// callers can decide how to handle it rather than silently masking an error.
async function readBlobFromOrigin(): Promise<ClinicConfig[] | null> {
  const result = await get(BLOB_KEY, { access: 'private', useCache: false })
  if (!result) return null
  const text = await new Response(result.stream).text()
  return JSON.parse(text) as ClinicConfig[]
}

// Cross-request cache via the Next.js Data Cache: the Blob store is read at most
// once per PUBLIC_CACHE_SECONDS across ALL serverless instances, instead of on
// every visitor request. This is the key to keeping Blob operations orders of
// magnitude lower — the difference between staying under the Hobby-plan limits
// and hitting them under real ad traffic.
const readBlobCached = unstable_cache(readBlobFromOrigin, ['clinics-blob-json'], {
  revalidate: PUBLIC_CACHE_SECONDS,
})

// Read for public rendering: cached, and never throws — on failure it logs and
// returns null so the caller falls back to SEED_CLINICS rather than 500ing.
// A thrown (failed) read is not cached, so the next request retries.
async function readBlobForPublic(): Promise<ClinicConfig[] | null> {
  if (!hasBlob()) return null
  try {
    return await readBlobCached()
  } catch (err) {
    console.error('[clinic-store] Failed to read clinics from Blob:', err)
    return null
  }
}

async function writeBlob(data: ClinicConfig[]): Promise<void> {
  if (!hasBlob()) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is not configured — cannot persist clinics. ' +
        'Create a Vercel Blob store and link it to this project.'
    )
  }
  await put(BLOB_KEY, JSON.stringify(data, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  })
}

/**
 * All admin-managed clinics for PUBLIC rendering. Cached (see above) and falls
 * back to SEED_CLINICS when the store is empty/unconfigured or temporarily
 * unreadable. Deduped per-request via React cache().
 */
export const getAllClinics = reactCache(async (): Promise<ClinicConfig[]> => {
  return (await readBlobForPublic()) ?? SEED_CLINICS
})

export async function getClinic(slug: string): Promise<ClinicConfig | null> {
  const all = await getAllClinics()
  return all.find((c) => c.slug === slug) ?? null
}

/** Resolve a slug to its clinic, falling back to the default brand for unknown slugs. */
export async function getClinicOrDefault(slug?: string): Promise<ClinicConfig> {
  if (!slug) return DEFAULT_CLINIC
  return (await getClinic(slug)) ?? DEFAULT_CLINIC
}

/**
 * Authoritative, uncached list read straight from origin. Used by the admin
 * panel (so edits are seen immediately) and as the base for mutations. THROWS
 * on a real read failure — callers must never merge an edit onto fallback/seed
 * data and write that back, which would wipe out every real clinic. Falls back
 * to SEED_CLINICS only when the store is genuinely empty (first-ever use).
 */
export async function getAllClinicsLive(): Promise<ClinicConfig[]> {
  return (await readBlobFromOrigin()) ?? SEED_CLINICS
}

/** Create or update a clinic (keyed by slug). */
export async function saveClinic(config: ClinicConfig): Promise<void> {
  const all = await getAllClinicsLive()
  const idx = all.findIndex((c) => c.slug === config.slug)
  const next =
    idx >= 0 ? all.map((c) => (c.slug === config.slug ? config : c)) : [...all, config]
  await writeBlob(next)
}

export async function deleteClinic(slug: string): Promise<void> {
  const all = await getAllClinicsLive()
  await writeBlob(all.filter((c) => c.slug !== slug))
}
