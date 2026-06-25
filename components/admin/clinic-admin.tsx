'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ClinicConfig, ClinicReview, ClinicTheme } from '@/lib/types'

const THEME_FIELDS: { key: keyof ClinicTheme; label: string }[] = [
  { key: 'coral', label: 'Coral (primär)' },
  { key: 'coralDeep', label: 'Coral mörk' },
  { key: 'coralSoft', label: 'Coral mjuk' },
  { key: 'gold', label: 'Guld (knapp)' },
  { key: 'goldDeep', label: 'Guld mörk' },
  { key: 'goldSoft', label: 'Guld mjuk' },
]

function emptyClinic(): ClinicConfig {
  return {
    slug: '',
    name: '',
    logoUrl: '/happident-logo.svg',
    phone: '',
    phoneTel: '',
    email: '',
    address: '',
    mapEmbedSrc: '',
    theme: {},
    reviews: [],
    webhookUrl: '',
    ordinaryPrice: '',
    monthlyFromPrice: '',
    openingHours: '',
    orgNumber: '',
    googleRating: undefined,
    showGoogleRating: true,
  }
}

const inputCls =
  'w-full font-body text-[15px] bg-cream border-[1.5px] border-border-strong rounded-[10px] py-2.5 px-3 transition-all focus:outline-none focus:border-coral focus:bg-white focus:shadow-[0_0_0_3px_var(--coral-soft)]'

export function ClinicAdmin({
  initialClinics,
  blobConfigured,
}: {
  initialClinics: ClinicConfig[]
  blobConfigured: boolean
}) {
  const router = useRouter()
  const [clinics, setClinics] = useState<ClinicConfig[]>(initialClinics)
  const [editing, setEditing] = useState<ClinicConfig | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function refresh() {
    const res = await fetch('/api/admin/clinics')
    if (res.ok) {
      const data = await res.json()
      setClinics(data.clinics)
    }
  }

  function startAdd() {
    setEditing(emptyClinic())
    setIsNew(true)
    setError('')
  }

  function startEdit(c: ClinicConfig) {
    setEditing({ ...c, theme: { ...(c.theme ?? {}) }, reviews: [...(c.reviews ?? [])] })
    setIsNew(false)
    setError('')
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error || 'Kunde inte spara')
        return
      }
      await refresh()
      setEditing(null)
    } catch {
      setError('Nätverksfel — försök igen')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Ta bort kliniken "${slug}"?`)) return
    const res = await fetch(`/api/admin/clinics?slug=${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    })
    if (res.ok) await refresh()
  }

  // ── Editor field helpers ──────────────────────────────────────────────────
  function set<K extends keyof ClinicConfig>(key: K, value: ClinicConfig[K]) {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev))
  }
  function setTheme(key: keyof ClinicTheme, value: string) {
    setEditing((prev) =>
      prev ? { ...prev, theme: { ...(prev.theme ?? {}), [key]: value } } : prev
    )
  }
  function setReview(i: number, patch: Partial<ClinicReview>) {
    setEditing((prev) => {
      if (!prev) return prev
      const reviews = [...(prev.reviews ?? [])]
      reviews[i] = { ...reviews[i], ...patch }
      return { ...prev, reviews }
    })
  }
  function addReview() {
    setEditing((prev) =>
      prev
        ? { ...prev, reviews: [...(prev.reviews ?? []), { stars: 5, quote: '', name: '', location: '' }] }
        : prev
    )
  }
  function removeReview(i: number) {
    setEditing((prev) =>
      prev ? { ...prev, reviews: (prev.reviews ?? []).filter((_, idx) => idx !== i) } : prev
    )
  }

  return (
    <main className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-[920px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-semibold text-3xl text-ink">Kliniker</h1>
            <p className="text-muted text-sm mt-1">
              Hantera kliniker som visas på <code className="text-coral-deep">/c/[slug]</code>
            </p>
          </div>
          <div className="flex gap-2.5">
            <button onClick={startAdd} className="btn-gold py-2.5 px-4 text-sm">
              + Ny klinik
            </button>
            <button
              onClick={handleLogout}
              className="py-2.5 px-4 text-sm font-semibold text-muted border border-border-strong rounded-full bg-surface hover:text-ink transition-colors"
            >
              Logga ut
            </button>
          </div>
        </div>

        {!blobConfigured && (
          <div className="mb-6 border border-[#E7C9A0] bg-[#FFF7EC] rounded-[var(--r-sm)] p-4 text-[13.5px] text-[#8a6d3b]">
            <b>Blob-lagring är inte konfigurerad.</b> Ändringar kan inte sparas förrän
            en Vercel Blob-store är kopplad (miljövariabel <code>BLOB_READ_WRITE_TOKEN</code>).
            Listan nedan visar standardvärden från koden.
          </div>
        )}

        {/* Clinic list */}
        <div className="bg-surface border border-border rounded-[var(--r)] overflow-hidden">
          {clinics.length === 0 && (
            <div className="p-6 text-muted text-sm">Inga kliniker ännu. Skapa din första.</div>
          )}
          {clinics.map((c) => (
            <div
              key={c.slug}
              className="flex items-center gap-4 p-4 border-b border-border last:border-b-0"
            >
              <span
                className="w-8 h-8 rounded-lg flex-shrink-0 border border-border"
                style={{ background: c.theme?.coral || 'var(--coral)' }}
                aria-hidden
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-ink truncate">{c.name}</div>
                <div className="text-[13px] text-muted truncate">
                  /c/{c.slug}
                  {c.webhookUrl ? ' · webhook ✓' : ' · ingen webhook'}
                  {c.reviews?.length ? ` · ${c.reviews.length} recensioner` : ''}
                </div>
              </div>
              <a
                href={`/c/${c.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-[13px] font-semibold text-muted hover:text-ink"
              >
                Förhandsgranska
              </a>
              <button
                onClick={() => startEdit(c)}
                className="text-[13px] font-semibold text-coral-deep hover:underline"
              >
                Redigera
              </button>
              <button
                onClick={() => handleDelete(c.slug)}
                className="text-[13px] font-semibold text-muted hover:text-coral-deep"
              >
                Ta bort
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor drawer */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-[rgba(38,32,27,0.5)] flex justify-end"
          onClick={() => !saving && setEditing(null)}
        >
          <div
            className="w-full max-w-[560px] h-full bg-surface overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-xl text-ink">
                {isNew ? 'Ny klinik' : `Redigera ${editing.name || editing.slug}`}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="text-muted hover:text-ink text-sm font-semibold"
              >
                Stäng
              </button>
            </div>

            <div className="grid gap-4">
              <Field label="Slug (URL: /c/slug)">
                <input
                  className={inputCls}
                  value={editing.slug}
                  disabled={!isNew}
                  placeholder="t.ex. goteborg"
                  onChange={(e) => set('slug', e.target.value.toLowerCase())}
                />
              </Field>

              <Field label="Namn">
                <input className={inputCls} value={editing.name} onChange={(e) => set('name', e.target.value)} />
              </Field>

              <Field label="Logotyp-URL (sökväg i /public eller absolut URL)">
                <input className={inputCls} value={editing.logoUrl} onChange={(e) => set('logoUrl', e.target.value)} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Telefon (visas)">
                  <input className={inputCls} value={editing.phone} onChange={(e) => set('phone', e.target.value)} />
                </Field>
                <Field label="Telefon (tel:)">
                  <input className={inputCls} value={editing.phoneTel} placeholder="+4631..." onChange={(e) => set('phoneTel', e.target.value)} />
                </Field>
              </div>

              <Field label="E-post">
                <input className={inputCls} value={editing.email} onChange={(e) => set('email', e.target.value)} />
              </Field>

              <Field label="Adress (visas i klinikavsnittet)">
                <input className={inputCls} value={editing.address} onChange={(e) => set('address', e.target.value)} />
              </Field>

              <Field label="Öppettider (visas i klinikavsnittet)">
                <input
                  className={inputCls}
                  value={editing.openingHours ?? ''}
                  placeholder="t.ex. Mån–Fre 08:00–17:00"
                  onChange={(e) => set('openingHours', e.target.value)}
                />
              </Field>

              <Field label="Organisationsnummer (visas i sidfoten)">
                <input
                  className={inputCls}
                  value={editing.orgNumber ?? ''}
                  placeholder="XXXXXX-XXXX"
                  onChange={(e) => set('orgNumber', e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Ordinarie pris (genomstruket)">
                  <input
                    className={inputCls}
                    value={editing.ordinaryPrice ?? ''}
                    placeholder="t.ex. 1 590 kr"
                    onChange={(e) => set('ordinaryPrice', e.target.value)}
                  />
                </Field>
                <Field label="Lägsta pris/mån (finansiering)">
                  <input
                    className={inputCls}
                    value={editing.monthlyFromPrice ?? ''}
                    placeholder="t.ex. 300 kr"
                    onChange={(e) => set('monthlyFromPrice', e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4 items-end">
                <Field label="Google-betyg (0–5)">
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    className={inputCls}
                    value={editing.googleRating ?? ''}
                    placeholder="t.ex. 4.7"
                    onChange={(e) =>
                      set('googleRating', e.target.value === '' ? undefined : Number(e.target.value))
                    }
                  />
                </Field>
                <label className="flex items-center gap-2 pb-2.5 text-[14px] font-medium text-ink">
                  <input
                    type="checkbox"
                    checked={editing.showGoogleRating !== false}
                    onChange={(e) => set('showGoogleRating', e.target.checked)}
                  />
                  Visa Google-betyg på sidan
                </label>
              </div>

              <Field label="Google Maps embed-URL">
                <textarea
                  className={inputCls + ' min-h-[70px] resize-y'}
                  value={editing.mapEmbedSrc}
                  placeholder="https://www.google.com/maps?q=...&output=embed"
                  onChange={(e) => set('mapEmbedSrc', e.target.value)}
                />
              </Field>

              <Field label="Webhook-URL (leads skickas hit)">
                <input
                  className={inputCls}
                  value={editing.webhookUrl ?? ''}
                  placeholder="https://..."
                  onChange={(e) => set('webhookUrl', e.target.value)}
                />
              </Field>

              {/* Theme */}
              <div>
                <div className="text-[13px] font-semibold text-ink mb-2">
                  Färger <span className="text-muted font-normal">(lämna tomt för standard)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {THEME_FIELDS.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <span
                        className="w-7 h-7 rounded-md border border-border-strong flex-shrink-0"
                        style={{ background: editing.theme?.[key] || 'transparent' }}
                      />
                      <input
                        className={inputCls + ' py-2'}
                        value={editing.theme?.[key] ?? ''}
                        placeholder={label}
                        onChange={(e) => setTheme(key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[13px] font-semibold text-ink">
                    Recensioner <span className="text-muted font-normal">(tomt = standardlista)</span>
                  </div>
                  <button onClick={addReview} className="text-[13px] font-semibold text-coral-deep hover:underline">
                    + Lägg till
                  </button>
                </div>
                <div className="grid gap-3">
                  {(editing.reviews ?? []).map((r, i) => (
                    <div key={i} className="border border-border rounded-[var(--r-sm)] p-3 grid gap-2">
                      <div className="flex gap-2">
                        <select
                          className={inputCls + ' py-2 w-[90px]'}
                          value={r.stars}
                          onChange={(e) => setReview(i, { stars: Number(e.target.value) })}
                        >
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>{n} ★</option>
                          ))}
                        </select>
                        <input
                          className={inputCls + ' py-2'}
                          placeholder="Namn"
                          value={r.name}
                          onChange={(e) => setReview(i, { name: e.target.value })}
                        />
                        <input
                          className={inputCls + ' py-2'}
                          placeholder="Ort"
                          value={r.location}
                          onChange={(e) => setReview(i, { location: e.target.value })}
                        />
                      </div>
                      <textarea
                        className={inputCls + ' py-2 min-h-[56px] resize-y'}
                        placeholder="Citat"
                        value={r.quote}
                        onChange={(e) => setReview(i, { quote: e.target.value })}
                      />
                      <button
                        onClick={() => removeReview(i)}
                        className="text-[12.5px] text-muted hover:text-coral-deep justify-self-start"
                      >
                        Ta bort recension
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="text-coral-deep text-sm">{error}</p>}

              <div className="flex gap-3 pt-2 pb-4 sticky bottom-0 bg-surface">
                <button onClick={handleSave} disabled={saving} className="btn-gold py-3 px-6 text-[15px] disabled:opacity-60">
                  {saving ? 'Sparar…' : 'Spara'}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  disabled={saving}
                  className="py-3 px-5 text-[15px] font-semibold text-muted border border-border-strong rounded-full hover:text-ink transition-colors"
                >
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-ink mb-1.5">{label}</span>
      {children}
    </label>
  )
}
