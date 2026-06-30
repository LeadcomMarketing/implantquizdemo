import { NextRequest, NextResponse } from 'next/server'
import { getClinicOrDefault } from '@/lib/clinic-store'

interface LeadPayload {
  name: string
  phone: string
  email: string
  gdprConsent: boolean
  source: string
  quizAnswers: Record<string, string>
  clinic: string
}

function validateLead(body: unknown): { valid: true; data: LeadPayload } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Empty body' }
  const b = body as Record<string, unknown>

  if (!b.name || typeof b.name !== 'string' || b.name.trim().length < 2)
    return { valid: false, error: 'Invalid name' }
  if (!b.phone || typeof b.phone !== 'string' || b.phone.trim().length < 5)
    return { valid: false, error: 'Invalid phone' }
  if (!b.email || typeof b.email !== 'string' || !b.email.includes('@'))
    return { valid: false, error: 'Invalid email' }
  if (b.gdprConsent !== true)
    return { valid: false, error: 'GDPR consent required' }

  return {
    valid: true,
    data: {
      name: (b.name as string).trim(),
      phone: (b.phone as string).trim(),
      email: (b.email as string).trim(),
      gdprConsent: true,
      source: typeof b.source === 'string' ? b.source : 'unknown',
      quizAnswers: (b.quizAnswers && typeof b.quizAnswers === 'object')
        ? (b.quizAnswers as Record<string, string>)
        : {},
      clinic: typeof b.clinic === 'string' ? b.clinic : 'default',
    },
  }
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const result = validateLead(body)
  if (!result.valid) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 422 })
  }

  const { data } = result
  const clinicConfig = await getClinicOrDefault(data.clinic)
  const createdAt = new Date().toISOString()
  console.log('[LEAD]', createdAt, clinicConfig.slug, JSON.stringify(data, null, 2))

  // Forward to this clinic's webhook if it has one, else fall back to the global LEAD_WEBHOOK_URL.
  const webhookUrl = clinicConfig.webhookUrl || process.env.LEAD_WEBHOOK_URL
  console.log('[LEAD] webhook target:', webhookUrl ?? '(none configured)')
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, createdAt }),
      })
    } catch (err) {
      console.error('[LEAD] webhook delivery failed:', err)
    }
  }

  // TODO: Send to Meta Conversions API
  // const META_CAPI_TOKEN = process.env.META_CAPI_TOKEN
  // const META_PIXEL_ID = process.env.META_PIXEL_ID
  // if (META_CAPI_TOKEN && META_PIXEL_ID) {
  //   const crypto = await import('crypto')
  //   const hashedEmail = crypto.createHash('sha256').update(data.email.toLowerCase()).digest('hex')
  //   const hashedPhone = crypto.createHash('sha256').update(data.phone.replace(/\D/g, '')).digest('hex')
  //   await fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       data: [{
  //         event_name: 'Lead',
  //         event_time: Math.floor(Date.now() / 1000),
  //         action_source: 'website',
  //         user_data: { em: [hashedEmail], ph: [hashedPhone] },
  //         custom_data: { source: data.source, clinic: data.clinic },
  //       }],
  //     }),
  //   })
  // }

  return NextResponse.json({ ok: true })
}
