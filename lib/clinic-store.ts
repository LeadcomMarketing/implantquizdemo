import 'server-only'
import { get, put } from '@vercel/blob'
import type { ClinicConfig } from '@/lib/types'
import { DEFAULT_CLINIC, SEED_CLINICS } from '@/lib/clinics'

// Single JSON blob holding all admin-managed clinics.
const BLOB_KEY = 'clinics/clinics.json'

// Short-lived in-memory cache so the public /c/[clinic] route doesn't hit the
// network on every request. Busted immediately on every write.
const TTL_MS = 30_000
let cache: { data: ClinicConfig[]; at: number } | null = null

// Vercel can authenticate Blob either via a static BLOB_READ_WRITE_TOKEN or,
// for stores connected through "Connect Database", via OIDC using BLOB_STORE_ID
// plus the platform's auto-injected VERCEL_OIDC_TOKEN.
export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

function hasBlob(): boolean {
  return isBlobConfigured()
}

async function readBlob(): Promise<ClinicConfig[] | null> {
  if (!hasBlob()) return null
  const result = await get(BLOB_KEY, { access: 'private', useCache: false })
  if (!result) return null
  const text = await new Response(result.stream).text()
  return JSON.parse(text) as ClinicConfig[]
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
  cache = { data, at: Date.now() }
}

/** All admin-managed clinics. Falls back to SEED_CLINICS when the store is empty/unconfigured. */
export async function getAllClinics(): Promise<ClinicConfig[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data
  const data = (await readBlob()) ?? SEED_CLINICS
  cache = { data, at: Date.now() }
  return data
}

export async function getClinic(slug: string): Promise<ClinicConfig | null> {
  const all = await getAllClinics()
  return all.find((c) => c.slug === slug) ?? null
}

/** Resolve a slug to its clinic, falling back to the default brand for unknown slugs. */
export async function getClinicOrDefault(slug?: string): Promise<ClinicConfig> {
  if (!slug) return DEFAULT_CLINIC
  return (await getClinic(slug)) ?? DEFAULT_CLINIC
}

/** Create or update a clinic (keyed by slug). */
export async function saveClinic(config: ClinicConfig): Promise<void> {
  const all = await getAllClinics()
  const idx = all.findIndex((c) => c.slug === config.slug)
  const next =
    idx >= 0 ? all.map((c) => (c.slug === config.slug ? config : c)) : [...all, config]
  await writeBlob(next)
}

export async function deleteClinic(slug: string): Promise<void> {
  const all = await getAllClinics()
  await writeBlob(all.filter((c) => c.slug !== slug))
}
