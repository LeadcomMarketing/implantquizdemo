import type { Metadata } from 'next'
import { QuizPage } from '@/components/quiz-page'
import { getClinicConfig, buildClinicThemeCSS } from '@/lib/clinics'

interface ClinicPageProps {
  params: Promise<{ clinic: string }>
}

export async function generateMetadata({ params }: ClinicPageProps): Promise<Metadata> {
  const { clinic: slug } = await params
  const clinic = getClinicConfig(slug)
  return {
    title: `${clinic.name} – Tandimplantat | Gratis analys`,
    description: `Ta reda på om tandimplantat är rätt för dig hos ${clinic.name} – och få ett fast pris från 300 kr/mån. Kostnadsfri konsultation.`,
  }
}

export default async function ClinicPage({ params }: ClinicPageProps) {
  const { clinic: slug } = await params
  const clinic = getClinicConfig(slug)
  const themeCSS = buildClinicThemeCSS(clinic)

  return (
    <>
      {themeCSS && <style dangerouslySetInnerHTML={{ __html: themeCSS }} />}
      <QuizPage clinic={clinic} />
    </>
  )
}
