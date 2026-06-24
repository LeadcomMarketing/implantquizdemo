import 'server-only'
import crypto from 'crypto'
import { cookies } from 'next/headers'

const COOKIE = 'admin_session'
const MAX_AGE_S = 60 * 60 * 24 * 7 // 7 days

function secret(): string {
  // Prefer a dedicated secret; fall back to the password so signing still works
  // if only ADMIN_PASSWORD is set.
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || ''
}

/** Constant-time check of a submitted password against ADMIN_PASSWORD. */
export function checkPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || ''
  if (!expected) return false
  const a = Buffer.from(submitted)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

function sign(exp: number): string {
  return crypto.createHmac('sha256', secret()).update(`admin:${exp}`).digest('hex')
}

export async function createSession(): Promise<void> {
  const exp = Date.now() + MAX_AGE_S * 1000
  const token = `${exp}.${sign(exp)}`
  const store = await cookies()
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_S,
  })
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE)
}

export async function isAuthed(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return false
  const [expStr, mac] = token.split('.')
  const exp = Number(expStr)
  if (!exp || Date.now() > exp || !mac) return false
  const expected = sign(exp)
  if (mac.length !== expected.length) return false
  return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))
}
