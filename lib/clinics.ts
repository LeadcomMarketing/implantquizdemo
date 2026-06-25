import type { ClinicConfig, ClinicTheme } from '@/lib/types'

// ─── Default clinic — current Happident brand, used at "/" and as the fallback
// for any unknown slug under /c/[clinic] ──────────────────────────────────────

export const DEFAULT_CLINIC: ClinicConfig = {
  slug: 'default',
  name: 'Happident',
  logoUrl: '/happident-logo.svg',
  phone: '010-330 31 00',
  phoneTel: '+46103303100',
  email: 'info@happident.se',
  address: 'Happident Stockholm — Kungsgatan 12, 111 35 Stockholm',
  mapEmbedSrc:
    'https://www.google.com/maps?q=Kungsgatan+12,+111+35+Stockholm&output=embed',
  ordinaryPrice: '1 590 kr',
  monthlyFromPrice: '300 kr',
  openingHours: 'Mån–Fre 08:00–17:00',
  googleRating: 4.7,
  showGoogleRating: true,
  // theme / reviews / webhookUrl / orgNumber intentionally omitted — uses the
  // built-in CSS defaults, the shared TESTIMONIALS list, and LEAD_WEBHOOK_URL
  // from env.
}

// ─── Seed clinics ───────────────────────────────────────────────────────────────
// Used as the fallback set when the Vercel Blob store is empty or unconfigured
// (e.g. local dev without a BLOB_READ_WRITE_TOKEN). Once a clinic is saved via the
// admin panel, the Blob store becomes the source of truth — see lib/clinic-store.ts.
//
// TODO: replace this placeholder entry with real clinic data, or delete it and
// manage all clinics from /admin.

export const SEED_CLINICS: ClinicConfig[] = [
  {
    slug: 'goteborg',
    name: 'Happident Göteborg',
    logoUrl: '/happident-logo.svg', // TODO: swap for this clinic's real logo (place file in /public)
    phone: '031-123 45 67',
    phoneTel: '+46311234567',
    email: 'goteborg@happident.se',
    address: 'Happident Göteborg — Avenyn 1, 411 36 Göteborg',
    mapEmbedSrc:
      'https://www.google.com/maps?q=Avenyn+1,+411+36+Göteborg&output=embed',
    theme: {
      coral: '#3D7FFF',
      coralDeep: '#2A5FE0',
      coralSoft: '#E8F0FF',
    },
    // reviews: undefined -> falls back to the shared TESTIMONIALS list
    webhookUrl: undefined, // TODO: this clinic's CRM webhook URL
    ordinaryPrice: '1 590 kr',
    monthlyFromPrice: '300 kr',
    openingHours: 'Mån–Fre 08:00–17:00',
    googleRating: 4.7,
    showGoogleRating: true,
  },
]

// ─── Theme helpers ──────────────────────────────────────────────────────────────

const THEME_CSS_VAR_MAP: Record<keyof ClinicTheme, string> = {
  coral: '--coral',
  coralDeep: '--coral-deep',
  coralSoft: '--coral-soft',
  gold: '--gold',
  goldDeep: '--gold-deep',
  goldSoft: '--gold-soft',
}

/** Renders a `:root{...}` CSS var override block for a clinic's theme, server-side. */
export function buildClinicThemeCSS(clinic: ClinicConfig): string {
  if (!clinic.theme) return ''
  const rules = Object.entries(clinic.theme)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${THEME_CSS_VAR_MAP[key as keyof ClinicTheme]}:${value};`)
    .join('')
  return rules ? `:root{${rules}}` : ''
}
