import { NextResponse } from 'next/server'
import { getAllClinicsLive, isBlobConfigured } from '@/lib/clinic-store'

// Never cached — every request performs a real, live read against the Blob
// store so an uptime monitor detects an actual outage rather than a cached OK.
export const dynamic = 'force-dynamic'

/**
 * Lightweight health check for external uptime monitoring (e.g. UptimeRobot).
 *
 * - 200 { status: "ok" }    → Blob store is reachable and readable
 * - 503 { status: "error" } → Blob read failed (the condition that once took
 *                             the whole site down); trips the monitor's alert.
 */
export async function GET() {
  const startedAt = Date.now()
  try {
    const clinics = await getAllClinicsLive()
    return NextResponse.json(
      {
        status: 'ok',
        blobConfigured: isBlobConfigured(),
        clinics: clinics.length,
        ms: Date.now() - startedAt,
        time: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      {
        status: 'error',
        blobConfigured: isBlobConfigured(),
        error: err instanceof Error ? err.message : String(err),
        ms: Date.now() - startedAt,
        time: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
