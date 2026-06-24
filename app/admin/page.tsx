import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { getAllClinics, isBlobConfigured } from '@/lib/clinic-store'
import { ClinicAdmin } from '@/components/admin/clinic-admin'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!(await isAuthed())) {
    redirect('/admin/login')
  }

  const clinics = await getAllClinics()
  const blobConfigured = isBlobConfigured()

  return <ClinicAdmin initialClinics={clinics} blobConfigured={blobConfigured} />
}
