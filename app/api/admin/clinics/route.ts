import { NextRequest, NextResponse } from 'next/server'
import { isAuthed } from '@/lib/auth'
import { getAllClinics, saveClinic, deleteClinic } from '@/lib/clinic-store'
import type { ClinicConfig, ClinicReview, ClinicTheme } from '@/lib/types'

async function requireAuth(): Promise<NextResponse | null> {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

const SLUG_RE = /^[a-z0-9-]+$/

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

function parseTheme(v: unknown): ClinicTheme | undefined {
  if (!v || typeof v !== 'object') return undefined
  const t = v as Record<string, unknown>
  const keys: (keyof ClinicTheme)[] = [
    'coral', 'coralDeep', 'coralSoft', 'gold', 'goldDeep', 'goldSoft',
  ]
  const out: ClinicTheme = {}
  for (const k of keys) {
    const val = str(t[k])
    if (val) out[k] = val
  }
  return Object.keys(out).length ? out : undefined
}

function parseRating(v: unknown): number | undefined {
  if (v === '' || v === null || v === undefined) return undefined
  const n = Number(v)
  if (!Number.isFinite(n)) return undefined
  return Math.min(5, Math.max(0, n))
}

function parseReviews(v: unknown): ClinicReview[] | undefined {
  if (!Array.isArray(v)) return undefined
  const out: ClinicReview[] = []
  for (const item of v) {
    if (!item || typeof item !== 'object') continue
    const r = item as Record<string, unknown>
    const quote = str(r.quote)
    const name = str(r.name)
    if (!quote || !name) continue
    out.push({
      stars: Math.min(5, Math.max(1, Number(r.stars) || 5)),
      quote,
      name,
      location: str(r.location),
    })
  }
  return out.length ? out : undefined
}

/** Validate + normalize an incoming clinic payload. */
function parseClinic(body: unknown): { ok: true; data: ClinicConfig } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Empty body' }
  const b = body as Record<string, unknown>

  const slug = str(b.slug).toLowerCase()
  if (!slug) return { ok: false, error: 'Slug krävs' }
  if (slug === 'default') return { ok: false, error: '"default" är reserverat' }
  if (!SLUG_RE.test(slug)) return { ok: false, error: 'Slug får bara innehålla a-z, 0-9 och bindestreck' }

  const name = str(b.name)
  if (!name) return { ok: false, error: 'Namn krävs' }

  const webhookUrl = str(b.webhookUrl)

  return {
    ok: true,
    data: {
      slug,
      name,
      logoUrl: str(b.logoUrl) || '/happident-logo.svg',
      phone: str(b.phone),
      phoneTel: str(b.phoneTel),
      email: str(b.email),
      address: str(b.address),
      mapEmbedSrc: str(b.mapEmbedSrc),
      theme: parseTheme(b.theme),
      reviews: parseReviews(b.reviews),
      webhookUrl: webhookUrl || undefined,
      ordinaryPrice: str(b.ordinaryPrice) || undefined,
      monthlyFromPrice: str(b.monthlyFromPrice) || undefined,
      openingHours: str(b.openingHours) || undefined,
      orgNumber: str(b.orgNumber) || undefined,
      googleRating: parseRating(b.googleRating),
      showGoogleRating: b.showGoogleRating !== false,
      bookingWidgetUrl: str(b.bookingWidgetUrl) || undefined,
    },
  }
}

export async function GET() {
  const unauth = await requireAuth()
  if (unauth) return unauth
  const clinics = await getAllClinics()
  return NextResponse.json({ ok: true, clinics })
}

export async function POST(req: NextRequest) {
  const unauth = await requireAuth()
  if (unauth) return unauth

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = parseClinic(body)
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 422 })
  }

  try {
    await saveClinic(parsed.data)
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Kunde inte spara' },
      { status: 500 }
    )
  }
  return NextResponse.json({ ok: true, clinic: parsed.data })
}

export async function DELETE(req: NextRequest) {
  const unauth = await requireAuth()
  if (unauth) return unauth

  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ ok: false, error: 'slug krävs' }, { status: 400 })
  }

  try {
    await deleteClinic(slug)
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Kunde inte ta bort' },
      { status: 500 }
    )
  }
  return NextResponse.json({ ok: true })
}
