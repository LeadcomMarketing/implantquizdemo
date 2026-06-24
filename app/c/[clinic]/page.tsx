import type { Metadata } from 'next'
import { QuizPage } from '@/components/quiz-page'
import { buildClinicThemeCSS } from '@/lib/clinics'
import { getClinicOrDefault } from '@/lib/clinic-store'

interface ClinicPageProps {
  params: Promise<{ clinic: string }>
}

export async function generateMetadata({ params }: ClinicPageProps): Promise<Metadata> {
  const { clinic: slug } = await params
  const clinic = await getClinicOrDefault(slug)
  return {
    title: `${clinic.name} – Tandimplantat | Gratis analys`,
    description: `Ta reda på om tandimplantat är rätt för dig hos ${clinic.name} – och få ett fast pris från 300 kr/mån. Kostnadsfri konsultation.`,
  }
}

export default async function ClinicPage({ params }: ClinicPageProps) {
  const { clinic: slug } = await params
  const clinic = await getClinicOrDefault(slug)
  const themeCSS = buildClinicThemeCSS(clinic)

  return (
    <>
      {themeCSS && <style dangerouslySetInnerHTML={{ __html: themeCSS }} />}
      <QuizPage clinic={clinic} />
    </>
  )
}
