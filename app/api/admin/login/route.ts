import { NextRequest, NextResponse } from 'next/server'
import { checkPassword, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const password = (body as { password?: unknown })?.password
  if (typeof password !== 'string' || !checkPassword(password)) {
    return NextResponse.json({ ok: false, error: 'Fel lösenord' }, { status: 401 })
  }

  await createSession()
  return NextResponse.json({ ok: true })
}
